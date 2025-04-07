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
    disease_name: "",
    description: "",
  });

  const [cows, setCows] = useState([]);
  const [healthChecks, setHealthChecks] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [rectalTemp, setRectalTemp] = useState(null);
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

    if (name === "cow") {
      const cowId = parseInt(value);
      const relatedSymptoms = symptoms.filter((s) => {
        const healthCheck = healthChecks.find((h) => h.id === s.health_check);
        return healthCheck && healthCheck.cow === cowId;
      });

      setForm((prev) => ({
        ...prev,
        cow: value,
        health_check: "",
        symptom: "",
        disease_name: "",
        description: "",
      }));

      setFilteredSymptoms(relatedSymptoms);
      setRectalTemp(null);
      return;
    }

    if (name === "symptom") {
      const selectedSymptom = symptoms.find((s) => s.id === parseInt(value));
      const relatedCheckId = selectedSymptom?.health_check || "";
      const relatedCheck = healthChecks.find((h) => h.id === relatedCheckId);

      setForm((prev) => ({
        ...prev,
        symptom: value,
        health_check: relatedCheckId,
      }));

      setRectalTemp(relatedCheck ? relatedCheck.rectal_temperature : null);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createDiseaseHistory({
        cow: form.cow,
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
                {/* Pilih Sapi */}
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

                {/* Pilih Gejala */}
                {form.cow && (
                  <>
                    {filteredSymptoms.length > 0 ? (
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
                      <div className="alert alert-warning">
                        Belum ada data gejala untuk sapi ini.
                      </div>
                    )}
                  </>
                )}

                {/* Suhu Rektal setelah pilih gejala */}
                {form.symptom && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Suhu Rektal</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        rectalTemp !== null
                          ? `${rectalTemp} °C`
                          : "Tidak tersedia"
                      }
                      readOnly
                    />
                  </div>
                )}

                {/* Nama Penyakit & Deskripsi */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Nama Penyakit</label>
                    <input
                      type="text"
                      name="disease_name"
                      value={form.disease_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                      disabled={!form.symptom}
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
                    required
                    disabled={!form.symptom}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-info w-100 fw-semibold"
                  disabled={submitting || !form.symptom}
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
