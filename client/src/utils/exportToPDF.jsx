import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const exportToPDF = async (element, fileName = "document", options = {}) => {
	try {
		if (!element) return;

		const canvasOptions = {
			scale: options.scale || 2,
			useCORS: true,
			allowTaint: false,
			backgroundColor: options.backgroundColor || "#ffffff",
			width: options.width || element.scrollWidth,
			height: options.height || element.scrollHeight,
			...options.canvasOptions,
		};

		const canvas = await html2canvas(element, canvasOptions);
		const imgData = canvas.toDataURL("image/png");

		const pdfOptions = {
			orientation: options.orientation || "portrait",
			unit: "mm",
			format: options.format || "a4",
			...options.pdfOptions,
		};

		const pdf = new jsPDF(pdfOptions);

		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();

		const imgWidth = pageWidth - (options.margin?.horizontal || 10) * 2;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;

		let heightLeft = imgHeight;
		let position = options.margin?.vertical || 10;

		pdf.addImage(
			imgData,
			"PNG",
			options.margin?.horizontal || 10,
			position,
			imgWidth,
			imgHeight
		);

		heightLeft -= pageHeight - (options.margin?.vertical || 10) * 2;

		while (heightLeft >= 0) {
			position =
				heightLeft - imgHeight + (options.margin?.vertical || 10);
			pdf.addPage();
			pdf.addImage(
				imgData,
				"PNG",
				options.margin?.horizontal || 10,
				position,
				imgWidth,
				imgHeight
			);
			heightLeft -= pageHeight - (options.margin?.vertical || 10) * 2;
		}

		pdf.save(`${fileName}.pdf`);

		toast.success("Export Invoice to PDF successfully!");
		return true;
	} catch (error) {
		console.error("Error while export PDF:", error);
		toast.error("Failed to export PDF. Please try again later.");
		return false;
	}
};
export default exportToPDF;
