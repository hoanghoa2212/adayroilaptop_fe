import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Modal,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteLaptop, findLaptops } from "../../../Redux/Admin/Laptop/Action";
import UpdateLaptopForm from "../UpdateLaptop/UpdateLaptop";
import { API_BASE_URL } from "../../../Config/api";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// ... (Giữ nguyên component ModelUpdate) ...
const ModelUpdate = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: 2,
        backdropFilter: "blur(5px)"
      }}
    >
      <Box className="relative rounded-md bg-black border border-gray-700 shadow-2xl w-full max-w-[1200px] max-h-[90vh] flex flex-col">
        <div className="absolute top-2 right-2 z-50">
            <IconButton
                onClick={props.handleClose}
                sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#f44336'
                    }
                }}
            >
                <CloseIcon />
            </IconButton>
        </div>

        <Box
          sx={{
            overflowY: "auto",
            padding: 0,
            flex: 1
          }}
        >
          <UpdateLaptopForm id={props.id} />
        </Box>
      </Box>
    </Modal>
  );
};

const LaptopsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { laptop } = useSelector((store) => store);

  // ... (Giữ nguyên logic searchParams, state, useEffect, handlers) ...
  const searchParams = new URLSearchParams(location.search);
  const availability = searchParams.get("availability");
  const category = searchParams.get("category");
  const sortPrice = searchParams.get("sortPrice");
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(null);

  const handlePaginationChange = (event, value) => {
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const data = {
      category: category || "",
      colors: [],
      sizes: [],
      minPrice: 0,
      minDiscount: 0,
      sortPrice: sortPrice || "increase",
      page: pageNumber,
      pageSize: 10,
      stock: availability,
    };
    dispatch(findLaptops(data));
  }, [availability, category, sortPrice, pageNumber, laptop?.deleteLaptop]);

  const handleDeleteLaptop = (laptopId) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa laptop này?")) {
       dispatch(deleteLaptop(laptopId));
    }
  };

  const handleUpdate = (id) => {
    if (id) {
      setOpen(true);
      setUpdate(id);
    }
  };

  const laptopList = laptop?.laptops?.content || [];
  const totalPages = laptop?.laptops?.totalPages || 1;

  return (
    <Box width={"100%"}>
      <ModelUpdate open={open} handleClose={handleClose} id={update} />
      <Card className="mt-2">
        <CardHeader
          title="Danh sách sản phẩm"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        
        {/* --- RESPONSIVE UPDATE: Thêm TableContainer với scroll ngang --- */}
        <TableContainer sx={{ overflowX: 'auto' }}> 
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Mẫu laptop</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Hạng mục</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Giá</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Số lượng</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Sửa</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Xóa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {laptopList.length > 0 ? (
                laptopList.map((item) => (
                  <TableRow
                    hover
                    key={item.id}
                    sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
                  >
                    <TableCell>
                      <Avatar
                        alt={item.model}
                        src={item.imageUrls && item.imageUrls.length > 0 ? `${API_BASE_URL}${item.imageUrls[0]}` : ""}
                        variant="rounded"
                      />
                    </TableCell>

                    <TableCell sx={{ py: (theme) => `${theme.spacing(0.5)} !important` }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontWeight: 500, fontSize: "0.875rem !important", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                          {item.model}
                        </Typography>
                        <Typography variant="caption">{item.brandName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item?.categories && item.categories.length > 0 ? item.categories[0].name : "N/A"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.price?.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item?.laptopColors && item.laptopColors.length > 0 ? item.laptopColors[0].quantity : 0}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      <Button variant="text" size="small" onClick={() => handleUpdate(item.id)}>
                        Sửa
                      </Button>
                    </TableCell>
                    <TableCell hidden={item.status === 0} sx={{ textAlign: "center" }}>
                      <Button
                        className={`${item.status === 0 ? "!hidden" : ""}`}
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteLaptop(item.id)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="body1">Không có sản phẩm nào</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card className="mt-2 border">
        <div className="mx-auto px-4 py-5 flex justify-center shadow-lg rounded-md">
          <Pagination
            count={totalPages}
            color="primary"
            page={pageNumber}
            onChange={handlePaginationChange}
            size="small" // Thu nhỏ pagination trên mobile
          />
        </div>
      </Card>
    </Box>
  );
};

export default LaptopsTable;