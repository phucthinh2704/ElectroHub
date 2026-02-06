import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { createSlug } from "./slug";

const exportToExcel = async (type, title, data, headers) => {
	try {
		// Tạo workbook mới
		const workbook = new ExcelJS.Workbook();

		// Thêm metadata
		workbook.creator = "React Excel Exporter";
		workbook.lastModifiedBy = "React Excel Exporter";
		workbook.created = new Date();
		workbook.modified = new Date();

		// Tạo worksheet
		const worksheet = workbook.addWorksheet(title, {
			properties: {
				defaultColWidth: 15,
				defaultRowHeight: 20,
			},
		});

		// 1. Cấu hình merge cell cho Title và Date
		// Tính toán cột cuối cùng dựa trên số lượng headers (Excel bắt đầu từ 1, A=1, B=2...)
		// String.fromCharCode(64 + number) chuyển số thành chữ cái (65='A')
		// Tuy nhiên cách đơn giản hơn là dùng logic dựa trên type
		let lastCol = "J"; // Mặc định cho products (10 cột)
		if (type === "users") lastCol = "H"; // 8 cột
		if (type === "orders") lastCol = "J"; // 10 cột (STT, ID, Name, Email, Phone, Address, Products, Total, Status, Date)

		// Thêm title
		worksheet.mergeCells(`A1:${lastCol}1`);
		const titleCell = worksheet.getCell("A1");
		titleCell.value = title;
		titleCell.font = {
			name: "Arial",
			size: 16,
			bold: true,
			color: { argb: "FFFFFF" },
		};
		titleCell.alignment = {
			horizontal: "center",
			vertical: "middle",
		};
		titleCell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "2E86AB" },
		};
		worksheet.getRow(1).height = 30;

		// Thêm thông tin ngày tạo
		worksheet.mergeCells(`A2:${lastCol}2`);
		const dateCell = worksheet.getCell("A2");
		dateCell.value = `Date created: ${new Date().toLocaleDateString(
			"vi-VN",
		)}`;
		dateCell.font = {
			name: "Arial",
			size: 11,
			italic: true,
		};
		dateCell.alignment = {
			horizontal: "center",
		};
		worksheet.getRow(2).height = 25;

		// Thêm header (dòng 4)
		const headerRow = worksheet.getRow(4);

		headers.forEach((header, index) => {
			const cell = headerRow.getCell(index + 1);
			cell.value = header;
			cell.font = {
				name: "Arial",
				size: 12,
				bold: true,
				color: { argb: "FFFFFF" },
			};
			cell.alignment = {
				horizontal: "center",
				vertical: "middle",
			};
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "4472C4" },
			};
			cell.border = {
				top: { style: "thin", color: { argb: "000000" } },
				left: { style: "thin", color: { argb: "000000" } },
				bottom: { style: "thin", color: { argb: "000000" } },
				right: { style: "thin", color: { argb: "000000" } },
			};
		});
		headerRow.height = 25;

		// Thêm dữ liệu (Bắt đầu từ dòng 5)
		data.forEach((item, index) => {
			const row = worksheet.getRow(index + 5);
			let rowData = [];

			// LOGIC XỬ LÝ DỮ LIỆU DỰA TRÊN TYPE
			if (type === "users") {
				rowData = [
					index + 1,
					item._id || "",
					item.name || "",
					item.email || "",
					item.mobile || "",
					item.role === "admin" ? "Admin" : "User",
					item.isBlocked === "true" ? "Blocked" : "Active",
					item.createdAt
						? new Date(item.createdAt).toLocaleDateString("vi-VN")
						: "",
				];
			} else if (type === "products") {
				rowData = [
					index + 1,
					item._id || "",
					item.title || "",
					item.category || "",
					item.brand || "",
					item.price ? item.price.toLocaleString("vi-VN") : "0",
					item.discount || 0,
					item.stock || 0,
					item.sold || 0,
					new Date(item.createdAt).toLocaleDateString("vi-VN"),
				];
			} else if (type === "orders") {
				// [CẬP NHẬT] Thêm logic xử lý cho đơn hàng
				// Dữ liệu 'item' ở đây đã được format sẵn từ ManageOrders.jsx
				rowData = [
					item.stt,
					item.orderId,
					item.customerName,
					item.email,
					item.phone,
					item.address,
					item.products, // Chuỗi text danh sách sản phẩm
					item.total
						? Number(item.total).toLocaleString("vi-VN")
						: "0",
					item.status.toUpperCase(), // Viết hoa status
					item.date,
				];
			}

			// Ghi dữ liệu vào từng ô trong dòng
			rowData.forEach((value, colIndex) => {
				const cell = row.getCell(colIndex + 1);
				cell.value = value;
				cell.font = {
					name: "Arial",
					size: 11,
				};

				// Căn lề: Cột ID và Sản phẩm/Email/Tên thì căn trái, còn lại căn giữa
				cell.alignment = {
					horizontal:
						colIndex === 1 ||
						colIndex === 2 ||
						colIndex === 3 ||
						colIndex === 5 ||
						colIndex === 6
							? "left"
							: "center",
					vertical: "middle",
					wrapText: colIndex === 6, // Wrap text cho cột danh sách sản phẩm (index 6 - cột thứ 7)
				};

				// Màu nền xen kẽ (Zebra striping)
				if (index % 2 === 0) {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: "F2F2F2" },
					};
				}

				// Format màu sắc cho cột Status
				// Orders: Status là cột index 8 (cột thứ 9)
				// Users: Status là cột index 6
				const isStatusCol =
					(type === "orders" && colIndex === 8) ||
					(type === "users" && colIndex === 6);

				if (isStatusCol) {
					const statusText = String(value).toLowerCase();
					if (statusText === "active" || statusText === "delivered") {
						cell.font = {
							...cell.font,
							color: { argb: "008000" },
							bold: true,
						}; // Green
					} else if (
						statusText === "blocked" ||
						statusText === "cancelled"
					) {
						cell.font = {
							...cell.font,
							color: { argb: "FF0000" },
							bold: true,
						}; // Red
					} else if (statusText === "processing") {
						cell.font = {
							...cell.font,
							color: { argb: "F59E0B" },
							bold: true,
						}; // Orange/Yellow
					} else if (statusText === "shipped") {
						cell.font = {
							...cell.font,
							color: { argb: "3B82F6" },
							bold: true,
						}; // Blue
					}
				}

				// Border
				cell.border = {
					top: { style: "thin", color: { argb: "CCCCCC" } },
					left: { style: "thin", color: { argb: "CCCCCC" } },
					bottom: { style: "thin", color: { argb: "CCCCCC" } },
					right: { style: "thin", color: { argb: "CCCCCC" } },
				};
			});

			// Set chiều cao dòng (nếu cột sản phẩm nhiều dòng thì tăng chiều cao)
			// Đếm số dòng xuống dòng trong cột products (index 6)
			if (type === "orders" && rowData[6]) {
				const lines = String(rowData[6]).split("\n").length;
				row.height = Math.max(25, lines * 15); // Tự động dãn dòng
			} else {
				row.height = 25;
			}
		});

		// Thêm tổng kết (Footer Summary)
		const summaryRow = worksheet.getRow(data.length + 6);
		summaryRow.getCell(2).value = "SUMMARY: ";
		summaryRow.getCell(2).font = { bold: true, size: 12 };

		// Vị trí cột Total Count
		const summaryColIndex =
			type === "users" ? 8 : type === "products" ? 10 : 10;
		summaryRow.getCell(summaryColIndex).value = `Total ${
			type === "orders"
				? "Orders"
				: type === "users"
					? "Users"
					: "Products"
		}: ${data.length}`;
		summaryRow.getCell(summaryColIndex).font = {
			bold: true,
			size: 11,
		};

		// Tự động điều chỉnh độ rộng cột
		let columnWidths = [15, 20, 30, 20, 20, 15, 15, 20];
		if (type === "users") {
			columnWidths = [8, 20, 25, 30, 20, 15, 15, 20];
		}
		if (type === "products") {
			columnWidths = [8, 20, 30, 20, 20, 15, 15, 15, 15, 20];
		}
		if (type === "orders") {
			// STT, ID, Name, Email, Phone, Address, Products, Total, Status, Date
			columnWidths = [8, 15, 25, 25, 15, 30, 40, 20, 15, 20];
		}

		columnWidths.forEach((width, index) => {
			const column = worksheet.getColumn(index + 1);
			column.width = width;
		});

		// Xuất file
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});

		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${createSlug(title)}-${
			new Date().toISOString().split("T")[0]
		}.xlsx`;
		link.click();

		window.URL.revokeObjectURL(url);

		toast.success("Excel file exported successfully!");
	} catch (error) {
		console.error("Error exporting to Excel:", error);
		toast.error("Error exporting to Excel. Please try again.");
	}
};

export default exportToExcel;
