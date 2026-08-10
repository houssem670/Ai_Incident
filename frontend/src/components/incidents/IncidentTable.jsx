import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import SeverityChip from "./SeverityChip";
import StatusChip from "./StatusChip";
import ActionButtons from "./ActionButtons";

export default function IncidentTable({

    rows,

    onView,

    onEdit,

    onDelete,

}) {

    const columns = [

        {
            field: "id",
            headerName: "ID",
            width: 80,
        },

        {
            field: "created_at",
            headerName: "Date",
            flex: 1.4,
        },

        {
            field: "source_ip",
            headerName: "Source IP",
            flex: 1.3,
        },

        {
            field: "country",
            headerName: "Country",
            flex: 1,
        },

        {
            field: "severity",
            headerName: "Severity",
            flex: 1,

            renderCell: (params) => (
                <SeverityChip severity={params.value} />
            ),
        },

        {
            field: "status",
            headerName: "Status",
            flex: 1,

            renderCell: (params) => (
                <StatusChip status={params.value} />
            ),
        },

        {
            field: "actions",
            headerName: "Actions",
            flex: 1.2,
            sortable: false,

            renderCell: (params) => (

                <ActionButtons

                    onView={() => onView(params.row)}

                    onEdit={() => onEdit(params.row)}

                    onDelete={() => onDelete(params.row)}

                />

            ),

        },

    ];

    return (

        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
            }}
        >

            <DataGrid

                rows={rows}

                columns={columns}

                pageSizeOptions={[10, 20, 50]}

                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}

                disableRowSelectionOnClick

                autoHeight

            />

        </Paper>

    );

}