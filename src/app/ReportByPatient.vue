

<script>
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  // import DatePickerDay from '@components/datepicker/DatePicker'
  import DatePickerDay from '@/components/datepicker/DatePickerDayReport.vue'
  import moment from 'moment'
  import jsPDF from 'jspdf'
  // import numeral from 'numeral'
  import THSarabunNew from '@/assets/jspdfFont/THSarabunNew.js'
  import THSarabunBold from '@/assets/jspdfFont/THSarabunBold.js'
  export default {
    components: {
      DatePickerDay,
    },
    data: vm => ({

      toDayLists: '',
      search: '',
      startDay: null,
      endtDay: null,
      desserts: [],
      // dataTable
      headers: [
        { text: 'ลำดับ', value: 'No', width: 70, sortable: false },
        { text: 'HN', value: 'hn', width: 100, sortable: false },
        { text: 'ชื่อ - นามสกุล', align: 'start', value: 'name', width: 200, sortable: false },
        { text: 'ID card/Passport no', value: 'citizenID', width: 200, sortable: false },
        { text: 'วันเกิด', value: 'birth_date', width: 100, sortable: false },
        { text: 'เพศ', value: 'gender', width: 100, sortable: false },
        { text: 'เบอร์มือถือ', value: 'phone', width: 200, sortable: false },
        { text: 'อำเภอ/จังหวัด', value: 'address', width: 300, sortable: false },
        { text: 'สิทธิ์การรักษา', value: 'treatmentRights', width: 300, sortable: false },
        { text: 'โรคประจำตัว', value: 'congenitalDiseaseTxt', width: 300, sortable: false },
        { text: '', value: 'data-table-expand', width: '3%', sortable: false },
      ],
      expanded: [],
      singleExpand: true,
      // dialog
      dialog: false,
      actionBtn: 0,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,

      // today
      dayNum: null,
      dayText: null,
      monthText: null,
      yearText: null,
      nodata_SummaryReport: null,
      imageBase64: null
    }),
    computed: {
      ...mapGetters({
        apiUrl: 'apiUrl',
        storeID: 'storeID',
        branchID: 'branchID',
        agenID: 'agenID',
        isToken: 'isToken',
        chainodata: 'chainodata',
        storeName: 'storeName',
      }),
      titleModal () {
        return this.actionBtn === 1 ? 'เลื่อนนัด' : 'ยกเลิกนัดหมาย'
      },
    },
    watch: {

    },
    async mounted () {
      this.nodata_SummaryReport = this.chainodata + 'เวชระเบียนผู้ป่วย'
    },
    methods: {
      async PrintPDF () {
        const vm = this

       // console.log(this.PayDATA)
       // console.log(this.desserts)
        var DATAUSE = []
        await this.desserts.map((data, index) => {
          var dataList = []
          dataList.push(vm.tempDATA(index + 1, 1, 0, 'left', 'THSarabunNew')) // ลำดับ
          dataList.push(vm.tempDATA(data.hn, 1, 0, 'left', 'THSarabunNew')) // hn
          dataList.push(vm.tempDATA(data.name, 1, 0, 'left', 'THSarabunNew')) // ชื่อ-นามสกุล
          dataList.push(vm.tempDATA(data.birth_date ? data.birth_date : '', 1, 0, 'left', 'THSarabunNew')) // วันเกิด
          dataList.push(vm.tempDATA(data.gender ? data.gender : '', 1, 0, 'left', 'THSarabunNew')) // เพศ
          dataList.push(vm.tempDATA(data.phone, 1, 0, 'left', 'THSarabunNew')) // เบอร์
          dataList.push(vm.tempDATA(data.address, 1, 0, 'left', 'THSarabunNew')) // อำเภอ จังหวัด
          dataList.push(vm.DATAellipsize(data.treatmentRights ? data.treatmentRights : '', 1, 0, 'left', 'THSarabunNew','ellipsize')) // สิทธิ์
          dataList.push(vm.DATAellipsize(data.congenitalDiseaseTxt, 1, 0, 'left', 'THSarabunNew','ellipsize')) // โรค
          DATAUSE.push(dataList)
        })
        var doc = jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true,
          lineHeight: 1.5,
          floatPrecision: 16, // or "smart", default is 16
        })
        var y = 40
        var pagecurhead1 = 1
        // var pagecurhead3 = 1
        doc.addFileToVFS('THSarabunNew-normal.ttf', THSarabunNew)
        doc.addFileToVFS('THSarabun Bold.ttf', THSarabunBold)
        doc.addFont('THSarabunNew-normal.ttf', 'THSarabunNew', 'normal')
        doc.addFont('THSarabun Bold.ttf', 'THSarabunBold', 'normal')
        // console.log(UseDATA)

        this.PromiseImageConvert().then(function (defs) {
          doc.autoTable({
            margin: { top: y, bottom: 15 },
            theme: 'plain',
            columnStyles: {
              0: {
                cellWidth: 10, //ลำดับ
              },
              1: {
                cellWidth: 15, //hn
              },
              2: {
                cellWidth: 26, //ชื่อ-นามสกุล
              },
              3: {
                cellWidth: 15, //วันเกิด
              },
              4: {
                cellWidth: 8, // เพศ
              },
              5: {
                cellWidth: 20, //เบอร์
              },
              6: {
                cellWidth: 37, //จังหวัด
              },
              7: {
                cellWidth: 20, //สิทธิ์
              },
              8: {
                cellWidth: 'auto', //โรค
              },
            },
            head: [
              [{ content: 'ลำดับ', colSpan: 1, styles: { halign: 'left' } },
                { content: 'HN', colSpan: 1, styles: { halign: 'center' } },
                { content: 'ชื่อ - นามสกุล', colSpan: 1, styles: { halign: 'left' } },
                { content: 'ว/ด/ป เกิด', colSpan: 1, styles: { halign: 'left' } },
                { content: 'เพศ', colSpan: 1, styles: { halign: 'left' } },
                { content: 'เบอร์โทรศัพท์', colSpan: 1, styles: { halign: 'left' } },
                { content: 'อำเภอ/จังหวัด', colSpan: 1, styles: { halign: 'left' } },
                { content: 'สิทธิ์การรักษา', colSpan: 1, styles: { halign: 'left' } },
                 { content: 'โรคประจำตัว', colSpan: 1, styles: { halign: 'center' } }],
            // head: [['ลำดับ','hn','ชื่อ - นามสกุล','วันเกิด','เพศ','เบอร์โทรศัพท์','อำเภอ/จังหวัด','สิทธิ์การรักษา','โรคประจำตัว']],
            ],
            body:
              DATAUSE,
            willDrawCell: function (data) {
              const uData = data.row
               //console.log(data)
              if (data.pageNumber === pagecurhead1 && uData.raw[0].content === 'ลำดับ') {
                                if (vm.imageBase64) {
                  doc.addImage(vm.imageBase64, 10, 5, 20, 20)
                } else {
                  doc.addImage(defs, 10, 5, 20, 20)
                }
                doc.line(0, data.cell.y - 1, 255, data.cell.y - 1)
                doc.setFontSize(16)
                doc.line(0, data.cell.y + 7, 255, data.cell.y + 7)
                doc.text(vm.storeName, 110, 15, 'center')
                doc.text('รายงานเวชระเบียนผู้ป่วย', 110, 22, 'center')
                doc.setFont('THSarabunNew')
                doc.setFontSize(11)
                doc.text('พิมพ์ ณ วันที่ ' + moment().locale('th').add(543, 'y').format('LL') + ' เวลา : ' + moment().locale('th').add(543, 'y').format('LT'), 15, 37, 'left')
                doc.text('หน้า ' + pagecurhead1, 190, 37, 'left')
                doc.setFont('THSarabunBold')
                doc.setFontSize(11)
                pagecurhead1 += 1
              }
              if (uData.raw[0].colSpan === 9) {
                doc.line(0, data.cell.y - 1, 255, data.cell.y - 1)
                doc.line(0, data.cell.y + 7, 255, data.cell.y + 7)
                doc.line(0, data.cell.y + 8, 255, data.cell.y + 8)
              }
            },
          })
          // console.log(DATAUSE)

          doc.save('รายงานเวชระเบียนผู้ป่วย ' +  moment().locale('th').add(543, 'y').format('LL')  + '.pdf')
        })
      },
      tempDATA (redata, recol, styleline, realign, refontStyle) {
        var data = { content: redata, colSpan: recol, styles: { lineWidth: styleline, halign: realign, font: refontStyle } }

        return data
      },
      DATAellipsize (redata, recol, styleline, realign, refontStyle ,reoverflow) {
        var data = { content: redata, colSpan: recol, styles: { lineWidth: styleline, halign: realign, font: refontStyle, overflow: reoverflow } }

        return data
      },
      convertImgToBase64 (url, callback, outputFormat) {
        var img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = function () {
          var canvas = document.createElement('CANVAS')
          var ctx = canvas.getContext('2d')
          canvas.height = this.height
          canvas.width = this.width
          ctx.drawImage(this, 0, 0)
          var dataURL = canvas.toDataURL(outputFormat || 'image/png')
          callback(dataURL)
          canvas = null
        }
        img.src = url
      },

       async PromiseImageConvert () {
        return new Promise((resolve, reject) => {
          this.convertImgToBase64(this.$refs.imageid.src, function (base64Img) {
            // if (error) reject(error)
            // else resolve(base64Img)
            resolve(base64Img)
          // return await base64Img
          })
        })
      },
    },
  }
</script>

<style>

</style>
