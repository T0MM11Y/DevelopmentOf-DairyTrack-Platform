import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDiseaseHistory } from "../../../../api/kesehatan/diseaseHistory";
import { getCows } from "../../../../api/peternakan/cow";
import { getHealthChecks } from "../../../../api/kesehatan/healthCheck";
import { getSymptoms } from "../../../../api/kesehatan/symptom";

const DiseaseHistoryCreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cow: "",
    health_check: "",
    symptom: "",
    disease_date: "",
    disease_name: "",
    description: "",
  });

  const [cows, setCows] = useState([]);
  const [healthChecks, setHealthChecks] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cowData = await getCows();
        const hcData = await getHealthChecks();
        const symptomData = await getSymptoms();
        setCows(cowData);
        setHealthChecks(hcData);
        setSymptoms(symptomData);
      } catch (err) {
        setError("Gagal memuat data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "cow") {
      const cowId = parseInt(value);
      const relatedHealthCheck = healthChecks.find((h) => h.cow === cowId);
      const healthCheckId = relatedHealthCheck ? relatedHealthCheck.id : "";

      const filteredSymps = symptoms.filter((s) => s.health_check === healthCheckId);

      setForm((prev) => ({
        ...prev,
        cow: value,
        health_check: healthCheckId || "",
        symptom: "",
      }));

      setFilteredSymptoms(filteredSymps);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createDiseaseHistory({
        cow: form.cow,
        disease_date: form.disease_date,
        disease_name: form.disease_name,
        description: form.description,
        symptom: form.symptom,
        health_check: form.health_check,
      });
      navigate("/admin/kesehatan/riwayat");
    } catch (err) {
      setError("Gagal menyimpan data riwayat penyakit.");
      console.error(err);
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
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title text-info fw-bold">Tambah Riwayat Penyakit</h4>
            <button
              className="btn-close"
              onClick={() => navigate("/admin/kesehatan/riwayat")}
              disabled={submitting}
            ></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger text-center">{error}</p>}
            {loading ? (
              <p className="text-center">Memuat data...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Pilih Sapi</label>
                  <select
                    name="cow"
                    value={form.cow}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">-- Pilih Sapi --</option>
                    {cows.map((cow) => (
                      <option key={cow.id} value={cow.id}>
                        {cow.name} ({cow.breed})
                      </option>
                    ))}
                  </select>
                </div>

                {form.health_check ? (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Pilih Gejala</label>
                    <select
                      name="symptom"
                      value={form.symptom}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Pilih Gejala --</option>
                      {filteredSymptoms.map((symp) => (
                        <option key={symp.id} value={symp.id}>
                          {symp.eye_condition} / {symp.behavior}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  form.cow && (
                    <p className="text-danger mb-3">
                      Sapi ini belum memiliki pemeriksaan kesehatan.
                    </p>
                  )
                )}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Tanggal Penyakit</label>
                    <input
                      type="date"
                      name="disease_date"
                      value={form.disease_date}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Nama Penyakit</label>
                    <input
                      type="text"
                      name="disease_name"
                      value={form.disease_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Deskripsi</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="form-control"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-info w-100 fw-semibold"
                  disabled={submitting}
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseHistoryCreatePage;
