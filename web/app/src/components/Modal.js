function Modal(props) {
  let modalSize = "modal-dialog";
  if (props.modalSize) {
    modalSize += " " + props.modalSize;
  }
  return (
    <>
      <div
        className="modal"
        id={props.id}
        tabIndex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className={modalSize}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {props.title}
              </h1>
              <button
                id="btnModalClose"
                type="button"
                className="btn-close btnClose"
                data-bs-dismiss="modal"
                aria-label="Close"
                data-dismiss="modal"
                
              ></button>
            </div>
            <div className="modal-body">{props.children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Modal;
