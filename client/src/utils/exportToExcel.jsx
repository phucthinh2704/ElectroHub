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

		// Thêm title
		worksheet.mergeCells(`${type === "users" ? "A1:H1" : "A1:J1"}`); // Sửa từ G1 thành H1 vì có 8 cột
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
		worksheet.mergeCells(`${type === "users" ? "A2:H2" : "A2:J2"}`); 
		const dateCell = worksheet.getCell("A2");
		dateCell.value = `Date created: ${new Date().toLocaleDateString(
			"vi-VN"
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

		// Thêm header
		// const headers = [
		// 	"STT",
		// 	"ID",
		// 	"Name",
		// 	"Email",
		// 	"Mobile",
		// 	"Role",
		// 	"Status",
		// 	"Join Date",
		// ];
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

		// Thêm dữ liệu
		data.forEach((item, index) => {
			const row = worksheet.getRow(index + 5);
			let rowData = [];
			if (type === "users") {
				rowData = [
					index + 1,
					item._id || "",
					item.name || "",
					item.email || "",
					item.mobile || "",
					item.role === "admin" ? "Admin" : "User",
					item.isBlocked === "true" || item.isBlocked === true
						? "Active"
						: "Blocked", // Sửa logic
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
			}

			rowData.forEach((value, colIndex) => {
				const cell = row.getCell(colIndex + 1);
				cell.value = value;
				cell.font = {
					name: "Arial",
					size: 11,
				};
				cell.alignment = {
					horizontal: colIndex === 1 ? "left" : "center", // ID column align left
					vertical: "middle",
				};

				// Màu nền xen kẽ
				if (index % 2 === 0) {
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: "F2F2F2" },
					};
				}

				// Màu sắc cho trạng thái (cột Status - index 6)
				if (colIndex === 6) {
					if (value === "Active") {
						cell.font = {
							...cell.font,
							color: { argb: "008000" },
							bold: true,
						};
					} else {
						cell.font = {
							...cell.font,
							color: { argb: "FF0000" },
							bold: true,
						};
					}
				}

				// Border cho tất cả cells
				cell.border = {
					top: { style: "thin", color: { argb: "CCCCCC" } },
					left: { style: "thin", color: { argb: "CCCCCC" } },
					bottom: { style: "thin", color: { argb: "CCCCCC" } },
					right: { style: "thin", color: { argb: "CCCCCC" } },
				};
			});
			row.height = 20;
		});

		// Thêm tổng kết
		const summaryRow = worksheet.getRow(data.length + 6);
		summaryRow.getCell(2).value = "SUMMARY: ";
		summaryRow.getCell(2).font = { bold: true, size: 12 };
		summaryRow.getCell(type === "users" ? 8 : 10).value = `Total ${
			type[0].toUpperCase() + type.slice(1)
		}: ${data.length}`;
		summaryRow.getCell(type === "users" ? 8 : 10).font = {
			bold: true,
			size: 11,
		};

		// Tự động điều chỉnh độ rộng cột
		let columnWidths = [15, 20, 30, 20, 20, 15, 15, 20]; // Mặc định cho các cột
		if (type === "users") {
			columnWidths = [8, 20, 25, 30, 20, 15, 15, 20]; // Tương ứng với 8 cột
		}
		if (type === "products") {
			columnWidths = [8, 20, 30, 20, 20, 15, 15, 15, 15, 20]; // Tương ứng với 10 cột
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

		// Thông báo thành công
		toast.success("Excel file exported successfully!");
	} catch (error) {
		console.error("Error exporting to Excel:", error);
		toast.error("Error exporting to Excel. Please try again.");
	}
};

export default exportToExcel;
