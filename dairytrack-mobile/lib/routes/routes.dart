import 'package:dairy_track/modules/home/home.dart';
import 'package:dairy_track/modules/pakan_sapi/menuPakan.dart';
import 'package:dairy_track/modules/penjualan/menuPenjualan.dart';
import 'package:dairy_track/modules/peternakan/cow/allCow.dart';
import 'package:dairy_track/modules/peternakan/menuPeternakan.dart';
import 'package:dairy_track/modules/peternakan/farmer/addPeternak.dart';
import 'package:dairy_track/modules/peternakan/farmer/allPeternak.dart';
import 'package:dairy_track/modules/produksi_susu/menuProduction.dart';
import 'package:dairy_track/modules/produksi_susu/dataProduksiSusu/dataProduksiSusu.dart';
import 'package:flutter/material.dart';

class Routes {
  // Route constants
  static const String home = '/home';
  static const String milkProduction = '/milk-production';
  static const String dataProduksiSusu = '/data-produksi-susu';
  static const String peternakan = '/peternakan';
  static const String allPeternak = '/all-peternak';
  static const String addPeternak = '/add-peternak';
  static const String allCow = '/all-cow';
  static const String pakan = '/pakan';
  static const String penjualan = '/penjualan';

  // Route mapping
  static Map<String, WidgetBuilder> getRoutes() {
    return {
      // Home route
      home: (context) => const HomeScreen(),

      // Milk production routes
      milkProduction: (context) => MenuProduction(),
      dataProduksiSusu: (context) => DataProduksiSusu(),

      // Peternakan routes
      peternakan: (context) => MenuPeternakan(),
      allPeternak: (context) => AllPeternak(),
      addPeternak: (context) => AddPeternak(),
      allCow: (context) => AllCow(),

      // Pakan route
      pakan: (context) => MenuPakan(),

      // Penjualan route
      penjualan: (context) => MenuPenjualan(),
    };
  }
}
