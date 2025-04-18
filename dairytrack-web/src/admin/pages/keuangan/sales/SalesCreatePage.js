import { useState, useEffect } from "react";
import { createOrder } from "../../../../api/keuangan/order";
import { getProductStocks } from "../../../../api/keuangan/product";
import { showAlert } from "../../../../admin/pages/keuangan/utils/alert";
import { useTranslation } from "react-i18next";


const SalesCreateModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone_number: "",
    location: "",
    shipping_cost: "",
    status: "Requested",
    order_items: [],
  });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({ product_type: "", quantity: "" });
  const { t } = useTranslation();

  useEffect(() => {
    const loadAvailableStock = async () => {
      try {
        const response = await getProductStocks();
        const groupedProducts = response.reduce((acc, product) => {
          if (product.status === "available") {
            const type = product.product_type;
            if (!acc[type]) {
              acc[type] = {
                product_type: type,
                product_name: product.product_type_detail.product_name,
                total_quantity: 0,
                image: product.product_type_detail.image,
              };
            }
            acc[type].total_quantity += product.quantity;
          }
          return acc;
        }, {});
        setAvailableProducts(Object.values(groupedProducts));
      } catch (err) {
        setError("Gagal memuat stok produk: " + err.message);
      }
    };
    loadAvailableStock();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const addOrderItem = () => {
    if (!newItem.product_type || !newItem.quantity) {
      setError("Pilih produk dan masukkan jumlah");
      return;
    }

    const selectedProduct = availableProducts.find(
      (p) => p.product_type === parseInt(newItem.product_type)
    );

    if (!selectedProduct) {
      setError("Produk tidak ditemukan");
      return;
    }

    const requestedQuantity = parseInt(newItem.quantity);
    if (selectedProduct.total_quantity < requestedQuantity) {
      setError(
        `Stok ${selectedProduct.product_name} tidak cukup. Tersedia: ${selectedProduct.total_quantity}`
      );
      return;
    }

    const existingItemIndex = form.order_items.findIndex(
      (item) => item.product_type === parseInt(newItem.product_type)
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...form.order_items];
      const newQuantity = updatedItems[existingItemIndex].quantity + requestedQuantity;
      
      if (selectedProduct.total_quantity < newQuantity) {
        setError(
          `Stok ${selectedProduct.product_name} tidak cukup. Tersedia: ${selectedProduct.total_quantity}`
        );
        return;
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity;
      
      setForm((prev) => ({
        ...prev,
        order_items: updatedItems,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        order_items: [
          ...prev.order_items,
          {
            product_type: parseInt(newItem.product_type),
            quantity: requestedQuantity,
          },
        ],
      }));
    }
    
    setNewItem({ product_type: "", quantity: "" });
    setError("");
  };

  const removeOrderItem = (index) => {
    setForm((prev) => ({
      ...prev,
      order_items: prev.order_items.filter((_, i) => i !== index),
    }));
  };

  const incrementItemQuantity = (index) => {
    const updatedItems = [...form.order_items];
    const currentItem = updatedItems[index];
    const selectedProduct = availableProducts.find(
      (p) => p.product_type === currentItem.product_type
    );
    
    if (currentItem.quantity + 1 > selectedProduct.total_quantity) {
      setError(
        `Stok ${selectedProduct.product_name} tidak cukup. Tersedia: ${selectedProduct.total_quantity}`
      );
      return;
    }
    
    updatedItems[index].quantity += 1;
    
    setForm((prev) => ({
      ...prev,
      order_items: updatedItems,
    }));
    setError("");
  };

  const decrementItemQuantity = (index) => {
    const updatedItems = [...form.order_items];
    const currentItem = updatedItems[index];
    
    if (currentItem.quantity <= 1) {
      removeOrderItem(index);
      return;
    }
    
    updatedItems[index].quantity -= 1;
    
    setForm((prev) => ({
      ...prev,
      order_items: updatedItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (form.order_items.length === 0) {
      setError("Tambahkan minimal satu item pesanan");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      shipping_cost: form.shipping_cost ? parseInt(form.shipping_cost) : undefined,
    };

    try {
      await createOrder(payload);
      await showAlert({
        type: "success",
        title: "Berhasil",
        text: "Pesanan berhasil dibuat.",
      });
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      let message = "Gagal membuat pesanan.";
      if (err.response && err.response.data) {
        message = err.response.data.message || message;
      }
      setError(message);
      await showAlert({
        type: "error",
        title: "Gagal Menyimpan",
        text: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{
        background: submitting ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
        minHeight: "100vh",
        paddingTop: "3rem",
      }}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content Бордер">
          <div className="modal-header">
            <h4 className="modal-title text-info fw-bold">{t('sales.create_order')}
            </h4>
            <button
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
            ></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">{t('sales.customer_name')}
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">{t('sales.customer_phone')}
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">{t('sales.customer_location')}
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">{t('sales.order_shipping_cost')}
                </label>
                <input
                  type="number"
                  name="shipping_cost"
                  value={form.shipping_cost}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Kosongkan jika tidak ada"
                  disabled={submitting}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">{t('sales.order_item')}
                </label>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <select
                      name="product_type"
                      value={newItem.product_type}
                      onChange={handleItemChange}
                      className="form-control"
                      disabled={submitting}
                    >
                      <option value="">-- {t('sales.select_product')}
                      --</option>
                      {availableProducts.map((product) => (
                        <option
                          key={product.product_type}
                          value={product.product_type}
                        >
                          {product.product_name} (Stok: {product.total_quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      name="quantity"
                      value={newItem.quantity}
                      onChange={handleItemChange}
                      className="form-control"
                      placeholder="Jumlah"
                      min="1"
                      disabled={submitting}
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={addOrderItem}
                      disabled={submitting}
                    >
                      {t('sales.add')}

                    </button>
                  </div>
                </div>
                {form.order_items.length > 0 && (
                  <div className="mt-3">
                    <h6>Daftar Item:</h6>
                    <ul className="list-group">
                      {form.order_items.map((item, index) => {
                        const product = availableProducts.find(
                          (p) => p.product_type === item.product_type
                        );
                        return (
                          <li
                            key={index}
                            className="list-group-item d-flex align-items-center"
                          >
                            <img
                              src={product?.image}
                              alt={product?.product_name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                marginRight: "15px",
                                borderRadius: "5px",
                              }}
                              onError={(e) => {
                                e.target.src = "/path/to/fallback-image.jpg";
                              }}
                            />
                            <div className="flex-grow-1">
                              {product?.product_name}
                            </div>
                            <div className="d-flex align-items-center me-3">
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => decrementItemQuantity(index)}
                                disabled={submitting}
                              >
                                -
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => incrementItemQuantity(index)}
                                disabled={submitting}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeOrderItem(index)}
                              disabled={submitting}
                            >
                              {t('sales.delete')}

                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-info w-100"
                disabled={submitting}
              >
                {submitting ? "Menyimpan..." : "Buat Pesanan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesCreateModal;