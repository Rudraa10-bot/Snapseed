function UploadReceipt() {
  return (
    <section className="section section-grey" id="upload">
      <div className="container">
        <h2 className="section-title">Upload Receipt</h2>
        <p className="section-desc">Upload a receipt image to extract expense details.</p>

        <div className="upload-box">
          <label htmlFor="receipt-file">Choose a receipt file from your device.</label>
          <br />
          <input type="file" id="receipt-file" accept=".jpg,.jpeg,.png,.pdf" />
          <br />
          <button className="btn btn-primary" type="button">Upload</button>
          <p className="formats">Supported formats: JPG, PNG, PDF</p>
        </div>
      </div>
    </section>
  );
}

export default UploadReceipt;
