import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./fonts/vfs_fonts";

function generatePdf(data) {
  pdfMake.addVirtualFileSystem(pdfFonts);
  pdfMake.fonts = {
    Times: {
      normal: 'timesnrcyrmt.ttf',
      bold: 'timesnrcyrmt_bold.ttf',
      italics: 'timesnrcyrmt_inclined.ttf',
      bolditalics: 'timesnrcyrmt_boldinclined.ttf'
    },
  }

  const workItems = data.workItems.map(workItem => {
    const result = [];
    const totalRating = workItem.items.reduce((a, item) => a + parseInt(item.rating), 0);
    result.push({ text: `${workItem.name} (максимально - ${totalRating} б.)`, style: "subheader", marginTop: 10 });

    const widths = workItem.items.map(() => 40);
    widths.unshift(80);

    const dates = workItem.items.map(i => ({ text: i.date, alignment: 'center' }));
    dates.unshift("Дата");

    const ratings = workItem.items.map(i => ({ text: i.rating, alignment: 'center' }));
    ratings.unshift("Максимально");

    const factRatings = workItem.items.map(i => "");
    factRatings.unshift("Фактично");

    result.push({
      table: {
        headerRows: 0,
        widths: widths,
        body: [
          dates,
          ratings,
          factRatings,
        ],
        dontBreakRows: true,
      },
      marginTop: 5
    });

    return result;
  });
  
  const ratingsTotal = data.workItems.reduce((a, workItem) => a + workItem.items.reduce((ac, item) => ac + parseInt(item.rating), 0), 0);
  const visitsTotal = 200 - ratingsTotal;

  const docDefinition = {
    content: [
      { text: data.subjectName, style: "header" },
      ...workItems,
      { 
        table: {
          headerRows: 0,
          widths: ["*", "*", "*"],
          body: [
            [{ text: "Всього по видах робіт", bold: true }, `Максимально - ${ratingsTotal}`, "Фактично -"],
            [{ text: "Відвідування уроків", bold: true }, `Максимально - ${visitsTotal} (${data.lessonPrice} б./урок)`, "Фактично -"],
            [{ text: "Всього за семестр", bold: true }, "Максимально - 200", "Фактично -"],
          ],
        },
        marginTop: 10
      }
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        alignment: 'center'
      },
      subheader: {
        fontSize: 11,
        bold: true,
      }
    },
    defaultStyle: {
      font: "Times",
      fontSize: 9,
    },
    pageSize: "A5",
    pageOrientation: 'landscape',
    pageMargins: [ 10, 10, 10, 10 ],
  };

  pdfMake.createPdf(docDefinition).download(`${data.subjectName}.pdf`);
}

export { generatePdf };