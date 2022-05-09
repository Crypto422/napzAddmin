import * as React from 'react';

const PreDeleteManyModal = (props: any) => {

    const {
        handleDelete
    } = props
    return (
        <div>
            <div className="modal fade" id="pre-delete-one-confirm-modal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Image</h5>
                            <div className="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                                <span className="svg-icon svg-icon-2x"></span>
                            </div>
                        </div>

                        <div className="modal-body">
                            <p>
                                Are you sure you want to delete?
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light" data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleDelete}
                            >
                                I'm sure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="modal fade" id="pre-delete-multi-confirm-modal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Mutiple Images</h5>
                            <div className="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                                <span className="svg-icon svg-icon-2x"></span>
                            </div>
                        </div>

                        <div className="modal-body">
                            <p>
                                Are you sure you want to delete multiple images?
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light" data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleDelete}
                            >
                                I'm sure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
           </div>
    )
}

export default PreDeleteManyModal;