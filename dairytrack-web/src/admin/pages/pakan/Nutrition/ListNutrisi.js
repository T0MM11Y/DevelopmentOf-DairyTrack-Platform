import { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { getAllDailyFeeds } from "../../../../api/pakan/dailyFeed";
import { getCows } from "../../../../api/peternakan/cow";
import ReactApexChart from "react-apexcharts";
import { useLocation, useNavigate } from "react-router-dom";

const FeedNutritionSummaryPage = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cowNames, setCowNames] = useState({});
  const [selectedCow, setSelectedCow] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = useCallback(async (abortController) => {
    try {
      setLoading(true);
      const params = {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
        cow_id: selectedCow || undefined,
      };

      const [feedsResponse, cowsResponse] = await Promise.all([
        getAllDailyFeeds(params, { signal: abortController.signal }),
        getCows().catch((err) => {
          console.error("Failed to fetch cows:", err);
          return [];
        }),
      ]);

      if (feedsResponse.success && feedsResponse.data) {
        setNutritionData(feedsResponse.data);
      } else {
        console.error("Unexpected feeds response:", feedsResponse);
        setNutritionData([]);
      }

      const cowMap = {};
      cowsResponse.forEach((cow) => {
        cowMap[cow.id] = cow.name;
      });
      setCowNames(cowMap);
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Failed to fetch data:", error.message);
      setNutritionData([]);
      Swal.fire({
        title: "Error!",
        text: "Gagal memuat data nutrisi.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate, selectedCow]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController);
    return () => {
      abortController.abort();
      setNutritionData([]);
    };
  }, [fetchData]);

  const filteredData = useMemo(() => {
    return nutritionData.filter((item) => {
      const dateMatch =
        new Date(item.date) >= new Date(dateRange.startDate) &&
        new Date(item.date) <= new Date(dateRange.endDate);
      const cowMatch = selectedCow ? item.cow_id.toString() === selectedCow : true;
      return dateMatch && cowMatch;
    });
  }, [nutritionData, dateRange.startDate, dateRange.endDate, selectedCow]);

  const uniqueCows = useMemo(() => {
    return [...new Set(nutritionData.map((item) => item.cow_id))];
  }, [nutritionData]);

  const chartData = useMemo(() => {
    if (!selectedCow) return [];
    const sortedData = [...filteredData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const groupedData = {};
    sortedData.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      const session = item.session.charAt(0).toUpperCase() + item.session.slice(1);
      const key = `${date} (${session})`;

      groupedData[key] = {
        date,
        fullDate: item.date,
        session,
        protein: parseFloat(item.total_protein) || 0,
        energy: parseFloat(item.total_energy) / 1000 || 0,
        fiber: parseFloat(item.total_fiber) || 0,
      };
    });

    return Object.values(groupedData);
  }, [filteredData, selectedCow]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleCowChange = (e) => {
    setSelectedCow(e.target.value);
    setCurrentPage(1);
  };

  const handleApplyFilters = useCallback(() => {
    if (!selectedCow) {
      Swal.fire({
        title: "Perhatian!",
        text: "Silakan pilih sapi terlebih dahulu untuk melihat grafik.",
        icon: "warning",
      });
      return;
    }
    if (new Date(dateRange.startDate) > new Date(dateRange.endDate)) {
      Swal.fire({
        title: "Perhatian!",
        text: "Tanggal mulai harus sebelum tanggal akhir.",
        icon: "warning",
      });
      return;
    }
    fetchData(new AbortController());
  }, [selectedCow, dateRange.startDate, dateRange.endDate, fetchData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const areaChartOptions = useMemo(() => ({
    series: [
      { name: "Protein (g)", data: chartData.map((item) => item.protein) },
      { name: "Energi (ribu kcal)", data: chartData.map((item) => item.energy) },
      { name: "Serat (g)", data: chartData.map((item) => item.fiber) },
    ],
    chart: {
      height: 350,
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#8884d8", "#82ca9d", "#ffc658"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: chartData.map((item) => `${item.date} (${item.session})`),
      labels: { rotate: -45, style: { fontSize: "12px" } },
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) =>
          seriesIndex === 1
            ? `${(val * 1000).toFixed(2)} kcal`
            : `${val.toFixed(2)} ${seriesIndex === 0 ? "g" : "g"}`,
      },
    },
    legend: { position: "top" },
  }), [chartData]);

  const pieChartOptions = useMemo(() => ({
    series:
      chartData.length > 0
        ? [
            chartData.reduce((sum, item) => sum + item.protein, 0) / chartData.length,
            chartData.reduce((sum, item) => sum + item.energy * 1000, 0) / chartData.length,
            chartData.reduce((sum, item) => sum + item.fiber, 0) / chartData.length,
          ]
        : [0, 0, 0],
    chart: { type: "donut", height: 300 },
    labels: ["Protein", "Energi", "Serat"],
    colors: ["#8884d8", "#82ca9d", "#ffc658"],
    legend: { position: "bottom" },
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { width: 200 }, legend: { position: "bottom" } },
      },
    ],
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(1) + "%",
    },
  }), [chartData]);

  const showFeedDetails = useCallback((item) => {
    if (!item.feedItems || item.feedItems.length === 0) {
      Swal.fire({
        title: "Info",
        text: "Tidak ada detail pakan tersedia.",
        icon: "info",
      });
      return;
    }

    const feedItems = item.feedItems.map((feedItem) => ({
      name: feedItem.feed.name,
      quantity: parseFloat(feedItem.quantity).toFixed(2),
      protein: parseFloat(feedItem.feed.protein).toFixed(2),
      energy: parseFloat(feedItem.feed.energy).toFixed(2),
      fiber: parseFloat(feedItem.feed.fiber).toFixed(2),
    }));

    Swal.fire({
      title: `Detail Pakan - ${cowNames[item.cow_id] || `Sapi #${item.cow_id}`}`,
      html: `
        <div class="text-start">
          <p><strong>Tanggal:</strong> ${formatDate(item.date)}</p>
          <p><strong>Sesi:</strong> ${item.session}</p>
          <p><strong>Cuaca:</strong> ${item.weather || "-"}</p>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Nama Pakan</th>
                <th class="text-end">Jumlah (kg)</th>
                <th class="text-end">Protein (g)</th>
                <th class="text-end">Energi (kcal)</th>
                <th class="text-end">Serat (g)</th>
              </tr>
            </thead>
            <tbody>
              ${feedItems
                .map(
                  (f) => `
                  <tr>
                    <td>${f.name}</td>
                    <td class="text-end">${f.quantity}</td>
                    <td class="text-end">${f.protein}</td>
                    <td class="text-end">${f.energy}</td>
                    <td class="text-end">${f.fiber}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `,
      width: "800px",
    });
  }, [cowNames]);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Ringkasan Nutrisi Pakan</h2>
          <p className="text-muted">Analisis nutrisi pakan harian sapi</p>
        </div>
        <button
          onClick={() => fetchData(new AbortController())}
          className="btn btn-secondary waves-effect waves-light"
          disabled={loading}
        >
          <i className="ri-refresh-line me-1"></i> Refresh
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">
                Pilih Sapi <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={selectedCow}
                onChange={handleCowChange}
                disabled={loading}
              >
                <option value="">-- Pilih Sapi --</option>
                {uniqueCows.map((cowId) => (
                  <option key={cowId} value={cowId}>
                    {cowNames[cowId] || `Sapi #${cowId}`}
                  </option>
                ))}
              </select>
              {!selectedCow && (
                <small className="text-muted">
                  Sapi harus dipilih untuk melihat grafik
                </small>
              )}
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Tanggal Mulai</label>
              <input
                type="date"
                className="form-control"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Tanggal Akhir</label>
              <input
                type="date"
                className="form-control"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div className="col-md-2 mb-3 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                <i className="ri-filter-3-line me-1"></i> Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Memuat data nutrisi...</p>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-xl-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    Grafik Nilai Nutrisi
                    {selectedCow && (
                      <span className="text-primary ms-2">
                        ({cowNames[selectedCow] || `Sapi #${selectedCow}`})
                      </span>
                    )}
                  </h5>
                  {!selectedCow ? (
                    <div className="alert alert-info text-center p-4">
                      <i className="ri-information-line fs-3 mb-3"></i>
                      <h5>Silakan Pilih Sapi</h5>
                      <p>Untuk melihat grafik nutrisi, harap pilih sapi terlebih dahulu.</p>
                    </div>
                  ) : chartData.length === 0 ? (
                    <div className="alert alert-warning text-center">
                      <i className="ri-error-warning-line me-2"></i>
                      Tidak ada data nutrisi tersedia untuk sapi dan rentang tanggal yang dipilih.
                    </div>
                  ) : (
                    <div id="nutrition-chart">
                      <ReactApexChart
                        options={areaChartOptions}
                        series={areaChartOptions.series}
                        type="area"
                        height={350}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Distribusi Nutrisi</h5>
                  {!selectedCow || chartData.length === 0 ? (
                    <div className="alert alert-info text-center p-3">
                      <i className="ri-information-line me-2"></i>
                      Data nutrisi tidak tersedia
                    </div>
                  ) : (
                    <div id="nutrition-distribution-chart">
                      <ReactApexChart
                        options={pieChartOptions}
                        series={pieChartOptions.series}
                        type="donut"
                        height={250}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {selectedCow && filteredData.length > 0 && (
            <div className="row mb-4">
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Rata-rata Protein
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {(filteredData.reduce((sum, item) => sum + parseFloat(item.total_protein || 0), 0) / filteredData.length).toFixed(2)} g
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="avatar-sm rounded-circle bg-primary bg-soft p-4 ms-3">
                          <span className="avatar-title rounded-circle h4 mb-0">🍖</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Rata-rata Energi
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {(filteredData.reduce((sum, item) => sum + parseFloat(item.total_energy || 0), 0) / filteredData.length).toFixed(2)} kcal
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="avatar-sm rounded-circle bg-success bg-soft p-4 ms-3">
                          <span className="avatar-title rounded-circle h4 mb-0">⚡</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Rata-rata Serat
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {(filteredData.reduce((sum, item) => sum + parseFloat(item.total_fiber || 0), 0) / filteredData.length).toFixed(2)} g
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="avatar-sm rounded-circle bg-warning bg-soft p-4 ms-3">
                          <span className="avatar-title rounded-circle h4 mb-0">🌿</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-info shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                          Total Pemberian Pakan
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {filteredData.length} kali
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="avatar-sm rounded-circle bg-info bg-soft p-4 ms-3">
                          <span className="avatar-title rounded-circle h4 mb-0">🐄</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedCow && (
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">
                    Riwayat Nutrisi Harian
                    {selectedCow && (
                      <span className="text-primary ms-2">
                        ({cowNames[selectedCow] || `Sapi #${selectedCow}`})
                      </span>
                    )}
                  </h4>
                  <button className="btn btn-sm btn-primary">
                    <i className="ri-download-2-line me-1"></i> Export
                  </button>
                </div>
                {paginatedData.length === 0 ? (
                  <div className="alert alert-info text-center">
                    Tidak ada data nutrisi tersedia untuk filter yang dipilih.
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-centered table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="text-center">#</th>
                            <th>Tanggal</th>
                            <th>Sesi</th>
                            <th>Cuaca</th>
                            <th className="text-center">Protein (g)</th>
                            <th className="text-center">Energi (kcal)</th>
                            <th className="text-center">Serat (g)</th>
                            <th className="text-center">Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                              <td>{formatDate(item.date)}</td>
                              <td>{item.session.charAt(0).toUpperCase() + item.session.slice(1)}</td>
                              <td>{item.weather ? item.weather.charAt(0).toUpperCase() + item.weather.slice(1) : "-"}</td>
                              <td className="text-center fw-bold text-primary">{parseFloat(item.total_protein).toFixed(2)}</td>
                              <td className="text-center fw-bold text-success">{parseFloat(item.total_energy).toFixed(2)}</td>
                              <td className="text-center fw-bold text-warning">{parseFloat(item.total_fiber).toFixed(2)}</td>
                              <td className="text-center">
                                <button
                                  className="btn btn-sm btn-info"
                                  onClick={() => showFeedDetails(item)}
                                  title="Lihat Detail"
                                  disabled={loading}
                                >
                                  <i className="ri-eye-line"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                          className="btn btn-outline-primary"
                          disabled={currentPage === 1 || loading}
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          Sebelumnya
                        </button>
                        <span>
                          Halaman {currentPage} dari {totalPages}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          disabled={currentPage === totalPages || loading}
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          Selanjutnya
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedNutritionSummaryPage;