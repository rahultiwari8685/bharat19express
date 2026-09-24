import React, { useState } from "react";
import {
    CCard,
    CCardHeader,
    CCardBody,
    CButton
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilList } from "@coreui/icons";

import PollForm from "./PollForm";
import PollList from "./PollList";

const Polls = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPoll, setEditPoll] = useState(null);

    return (
        <CCard>
            <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Poll Management</h5>

                    <CButton

                        color="light"
                        variant='outline'
                        className="fw-semibold px-3 shadow-sm rounded-pill"
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditPoll(null);
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        {showForm ? "View Polls" : "Create Poll"}
                    </CButton>
                </div>
            </CCardHeader>

            <CCardBody>
                {showForm ? (
                    <PollForm
                        editPoll={editPoll}
                        onSuccess={() => setShowForm(false)}
                    />
                ) : (
                    <PollList
                        onEdit={(poll) => {
                            setEditPoll(poll);
                            setShowForm(true);
                        }}
                    />
                )}
            </CCardBody>
        </CCard>
    );
};

export default Polls;
