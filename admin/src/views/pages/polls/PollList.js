import React, { useEffect, useState } from "react";
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CBadge
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil } from "@coreui/icons";
import axios from "axios";
import setting from "../../../setting.json";

const PollList = ({ onEdit }) => {
    const [polls, setPolls] = useState([]);

    const loadPolls = async () => {
        const res = await axios.get(`${setting.api}/api/polls/admin`);
        setPolls(res.data.data || []);
    };

    useEffect(() => {
        loadPolls();
    }, []);

    const getStatus = (poll) => {
        const now = new Date();
        if (now < new Date(poll.start_date)) return "Scheduled";
        if (now > new Date(poll.end_date)) return "Expired";
        return "Active";
    };

    return (
        <CTable hover responsive>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>SR.No</CTableHeaderCell>
                    <CTableHeaderCell>Question</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Start</CTableHeaderCell>
                    <CTableHeaderCell>End</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
            </CTableHead>

            <CTableBody>
                {polls.map((poll, i) => (
                    <CTableRow key={poll._id}>
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>{poll.question}</CTableDataCell>

                        <CTableDataCell>
                            <CBadge color={
                                getStatus(poll) === "Active" ? "success" :
                                    getStatus(poll) === "Scheduled" ? "info" : "secondary"
                            }>
                                {getStatus(poll)}
                            </CBadge>
                        </CTableDataCell>

                        <CTableDataCell>
                            {new Date(poll.start_date).toLocaleString()}
                        </CTableDataCell>

                        <CTableDataCell>
                            {new Date(poll.end_date).toLocaleString()}
                        </CTableDataCell>

                        <CTableDataCell>
                            <CButton
                                size="sm"
                                color="warning"
                                className="rounded-pill px-3 shadow-sm fw-semibold"
                                onClick={() => onEdit(poll)}
                            >
                                <CIcon icon={cilPencil} style={{ marginRight: '5px' }} />Edit
                            </CButton>
                        </CTableDataCell>
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    );
};

export default PollList;
