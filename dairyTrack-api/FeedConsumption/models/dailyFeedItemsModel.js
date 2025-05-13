const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const FeedStock = require("./feedStockModel");
const { calculateTotalNutrients } = require("./calculateNutrient");

const DailyFeedItems = sequelize.define(
  "DailyFeedItems",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    daily_feed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "daily_feed_schedule",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      validate: {
        notNull: { msg: "Daily feed ID is required" },
        isInt: { msg: "Daily feed ID must be an integer" },
      },
    },
    feed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "feed",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
      validate: {
        notNull: { msg: "Feed ID is required" },
        isInt: { msg: "Feed ID must be an integer" },
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Quantity is required" },
        isDecimal: { msg: "Quantity must be a decimal number" },
        min: { args: [0], msg: "Quantity must be at least 0" },
        async checkStock(value) {
          const feedStock = await FeedStock.findOne({
            where: { feedId: this.feed_id },
          });
          if (feedStock && parseFloat(value) > parseFloat(feedStock.stock)) {
            throw new Error(
              `Quantity exceeds available stock for feed ${this.feed_id}`
            );
          }
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    tableName: "daily_feed_items",
    timestamps: true, // Enable timestamps since we're adding createdAt/updatedAt
    hooks: {
      beforeCreate: async (item, options) => {
        const t = options.transaction;
        if (options.userId) {
          item.created_by = options.userId;
          item.updated_by = options.userId;
          item.user_id = options.userId;
        } else {
          throw new Error("User ID is required for creating DailyFeedItems");
        }

        const feedStock = await FeedStock.findOne({
          where: { feedId: item.feed_id },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!feedStock) {
          throw new Error(`Stock record not found for feed ${item.feed_id}`);
        }

        if (parseFloat(feedStock.stock) < parseFloat(item.quantity)) {
          throw new Error(
            `Not enough stock available for feed ${item.feed_id}`
          );
        }

        const newStock =
          parseFloat(feedStock.stock) - parseFloat(item.quantity);
        await feedStock.update({ stock: newStock }, { transaction: t });
      },
      beforeUpdate: async (item, options) => {
        const t = options.transaction;
        if (options.userId) {
          item.updated_by = options.userId;
        } else {
          throw new Error("User ID is required for updating DailyFeedItems");
        }

        const originalItem = await DailyFeedItems.findByPk(item.id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!originalItem) {
          throw new Error(`Original feed item not found for ID ${item.id}`);
        }

        const feedStock = await FeedStock.findOne({
          where: { feedId: item.feed_id },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!feedStock) {
          throw new Error(`Stock record not found for feed ${item.feed_id}`);
        }

        const originalQty = parseFloat(originalItem.quantity);
        const newQty = parseFloat(item.quantity);
        const difference = originalQty - newQty;

        if (difference < 0) {
          const additionalNeeded = Math.abs(difference);
          if (parseFloat(feedStock.stock) < additionalNeeded) {
            throw new Error(
              `Not enough stock available for feed ${item.feed_id}`
            );
          }
        }

        const newStock = parseFloat(feedStock.stock) + difference;
        await feedStock.update({ stock: newStock }, { transaction: t });
      },
      beforeDestroy: async (item, options) => {
        const t = options.transaction;

        const feedStock = await FeedStock.findOne({
          where: { feedId: item.feed_id },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!feedStock) {
          throw new Error(`Stock record not found for feed ${item.feed_id}`);
        }

        const newStock =
          parseFloat(feedStock.stock) + parseFloat(item.quantity);
        await feedStock.update({ stock: newStock }, { transaction: t });
      },
      afterCreate: async (item, options) => {
        await calculateTotalNutrients(item.daily_feed_id);
      },
      afterUpdate: async (item, options) => {
        await calculateTotalNutrients(item.daily_feed_id);
      },
      afterDestroy: async (item, options) => {
        await calculateTotalNutrients(item.daily_feed_id);
      },
    },
  }
);

module.exports = DailyFeedItems;