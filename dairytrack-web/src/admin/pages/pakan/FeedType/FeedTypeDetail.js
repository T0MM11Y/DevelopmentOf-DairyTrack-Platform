import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getFeedTypeById, updateFeedType } from "../../../../api/pakan/feedType";

const FeedTypeDetailEditModal = ({ feedId, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchFeedType = async () => {
      try {
        setLoading(true);
        console.log("Mengambil data jenis pakan dengan ID:", feedId);

        if (!feedId) {
          throw new Error("ID pakan tidak valid");
        }

        const response = await getFeedTypeById(feedId);
        console.log("Respons API:", response);

        if (!isMounted) return;

        if (!response) {
          throw new Error("Tidak ada respons dari API");
        }

        if (response.feedType && typeof response.feedType === "object") {
          console.log("Data Jenis Pakan:", response.feedType);
          setName(response.feedType.name || "");
        } else {
          throw new Error(
            response.message || "Jenis pakan tidak ditemukan atau format respons tidak valid"
          );
        }
      } catch (error) {
        console.error("Kesalahan saat mengambil data:", error.message);
        if (isMounted) {
          Swal.fire({
            title: "Terjadi Kesalahan!",
            text: `Gagal memuat data jenis pakan: ${error.message}`,
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            onClose();
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeedType();

    return () => {
      isMounted = false;
    };
  }, [feedId, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({
        title: "Terjadi Kesalahan!",
        text: "Nama Jenis Pakan wajib diisi!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data jenis pakan akan diperbarui.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Update",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    setUpdateLoading(true);
    try {
      const response = await updateFeedType(feedId, { name });
      console.log("Respons update:", response);

      if (response?.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Jenis pakan berhasil diperbarui.",
          icon: "success",
          confirmButtonText: "OK",
        });

        if (onSuccess) {
          onSuccess({ id: feedId, name });
        }
        onClose();
      } else {
        throw new Error(response?.message || "Gagal memperbarui jenis pakan.");
      }
    } catch (error) {
      console.error("Kesalahan saat update:", error.message);
      Swal.fire({
        title: "Terjadi Kesalahan!",
        text: error.message.includes("already exists")
          ? "Jenis pakan dengan nama ini sudah ada!"
          : `Gagal memperbarui jenis pakan: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(5px)",
        zIndex: 1050,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        className="modal-dialog"
        style={{
          maxWidth: "500px",
          margin: "auto",
        }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
            border: "none",
          }}
        >
          <div
            className="modal-header"
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #e9ecef",
              padding: "15px 20px",
            }}
          >
            <h5
              className="modal-title fw-bold"
              style={{ color: "#17a2b8", fontSize: "1.5rem" }}
            >
              Ubah Jenis Pakan
            </h5>
            <button
              className="btn-close"
              onClick={onClose}
              disabled={updateLoading}
              style={{ fontSize: "1.2rem" }}
            ></button>
          </div>
          <div className="modal-body" style={{ padding: "20px" }}>
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Memuat...</span>
                </div>
                <p className="mt-2">Memuat data...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="feedTypeName" className="form-label fw-semibold">
                    Nama Jenis Pakan
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="feedTypeName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Contoh: Konsentrat"
                    style={{
                      borderRadius: "8px",
                      padding: "10px",
                      fontSize: "1rem",
                    }}
                  />
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onClose}
                    disabled={updateLoading}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 20px",
                      fontSize: "1rem",
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-info"
                    disabled={updateLoading}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 20px",
                      fontSize: "1rem",
                    }}
                  >
                    {updateLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedTypeDetailEditModal;
