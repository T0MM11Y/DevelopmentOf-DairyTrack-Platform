import 'package:dairy_track/config/api/kesehatan/reproduction.dart';
import 'package:dairy_track/config/api/peternakan/cow.dart';
import 'package:dairy_track/model/kesehatan/reproduction.dart';
import 'package:dairy_track/model/peternakan/cow.dart';
import 'package:dairy_track/modules/pemeriksaan_kesehatan/reproduksi_sapi/editReproduksi.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AllReproduksi extends StatefulWidget {
  @override
  _AllReproduksiState createState() => _AllReproduksiState();
}

class _AllReproduksiState extends State<AllReproduksi> {
  List<Reproduction> reproductions = [];
  List<Cow> cows = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchAllData();
  }

  Future<void> fetchAllData() async {
    setState(() => isLoading = true);
    try {
      final fetchedReproductions = await getReproductions();
      final fetchedCows = await getCows();

      setState(() {
        reproductions = fetchedReproductions;
        cows = fetchedCows;
        error = null;
      });
    } catch (e) {
      setState(() {
        error = 'Gagal mengambil data: $e';
      });
    } finally {
      setState(() => isLoading = false);
    }
  }

  String getCowName(int cowId) {
    try {
      final cow = cows.firstWhere((c) => c.id == cowId);
      return '${cow.name} (${cow.breed})';
    } catch (e) {
      return 'Tidak diketahui';
    }
  }

  Future<void> confirmDelete(int reproductionId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Konfirmasi Hapus'),
        content: const Text('Yakin ingin menghapus data reproduksi ini?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Hapus'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await deleteReproduction(reproductionId);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Data reproduksi berhasil dihapus')),
        );
        setState(() {}); // ✅ Refresh tampilan
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Gagal menghapus data reproduksi')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Data Reproduksi Sapi'),
        backgroundColor: const Color.fromARGB(255, 93, 144, 231),
        elevation: 0,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : reproductions.isEmpty
                  ? const Center(child: Text('Tidak ada data reproduksi.'))
                  : ListView.builder(
                      itemCount: reproductions.length,
                      itemBuilder: (context, index) {
                        final item = reproductions[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          elevation: 4,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      getCowName(item.cowId),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        color: Colors.blue,
                                      ),
                                    ),
                                    Row(
                                      children: [
                                        IconButton(
                                          icon: const Icon(Icons.edit, color: Colors.orange),
                                          tooltip: 'Edit',
                                          onPressed: () {
                                            showDialog(
                                              context: context,
                                              builder: (_) => EditReproduksi(
                                                reproductionId: item.id,
                                                onClose: () => Navigator.of(context).pop(),
                                                onSaved: () {
                                                  Navigator.of(context).pop();
                                                  setState(() {}); // ✅ Refresh tampilan
                                                },
                                              ),
                                            );
                                          },
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.delete, color: Colors.red),
                                          tooltip: 'Delete',
                                          onPressed: () => confirmDelete(item.id),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Jarak Kelahiran: ${item.calvingInterval ?? "-"} hari',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Service Period: ${item.servicePeriod ?? "-"} hari',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Tingkat Konsepsi: ${item.conceptionRate?.toStringAsFixed(2) ?? "-"} %',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Tanggal Catat: ${DateFormat('dd MMM yyyy').format(item.recordedAt)}',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/add-reproduksi');
        },
        backgroundColor: Colors.blue[700],
        child: const Icon(Icons.add),
      ),
    );
  }
}
