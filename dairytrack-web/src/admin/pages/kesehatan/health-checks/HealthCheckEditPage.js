import { useEffect, useState } from "react";
import { getHealthCheckById, updateHealthCheck } from "../../../../api/kesehatan/healthCheck";

const HealthCheckEditPage = ({ healthCheckId, onClose, onSaved }) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHealthCheckById(healthCheckId);
        setForm(res);
      } catch (err) {
        setError("Gagal memuat data pemeriksaan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [healthCheckId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateHealthCheck(healthCheckId, form);
      if (onSaved) onSaved(); // panggil callback jika tersedia
    } catch (err) {
      setError("Gagal memperbarui data.");
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
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title text-info fw-bold">Edit Pemeriksaan</h4>
            <button className="btn-close" onClick={onClose} disabled={submitting}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger text-center">{error}</p>}
            {loading || !form ? (
              <div className="text-center py-5">
                <div className="spinner-border text-info" role="status" />
                <p className="mt-2">Memuat data pemeriksaan...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {Object.entries(form).map(([key, value]) => {
                    if (key === "id" || key === "cow") return null;
                    return (
                      <div className="col-md-6 mb-3" key={key}>
                        <label className="form-label fw-bold">
                          {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </label>
                        <input
                          type={key.includes("date") ? "datetime-local" : "text"}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="form-control"
                          disabled={submitting}
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  type="submit"
                  className="btn btn-info w-100"
                  disabled={submitting}
                >
                  {submitting ? "Memperbarui..." : "Perbarui Data"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckEditPage;
