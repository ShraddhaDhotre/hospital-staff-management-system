function AppModal({
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
  variant = 'primary',
  hideFooter = false,
}) {
  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
            {!hideFooter && (
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className={`btn btn-${variant}`} onClick={onConfirm}>
                  {confirmLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}

export default AppModal;
