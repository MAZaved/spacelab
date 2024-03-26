import icons from "./icons.js";
import webgradients from "./webgradients.js";
import fonts from "./fonts.js";
import imageData from "./imageData.js";

const app = new Vue({
  el: "#app",
  data: {
    iconsModalFlg: false,
    gradientsModalFlg: false,
    fontsModalFlg: false,
    title: "",
    title_en: "",
    icon: "",
    color: "",
    width: 780,
    height: 605,
    font: fonts[1],
    keyword: "",
    isDownloading: false,
    zoomPercentage: 100,
    imageData: "https://i.ibb.co/qsM9pqm/bg.jpg",
    imageName: "",
  },
  mounted() {
    var w = document.getElementById("preview").clientWidth;
    if (w < this.width) {
      this.zoomPercentage = ((w - 40) / this.width) * 100;
    }
  },
  computed: {
    fonts: function () {
      return fonts;
    },
    webgradients: function () {
      return webgradients;
    },
    sampleItems: function () {
      return [
        {
          title: "Wardrobe1",
          title_en: "Wardrobe1",
          icon: "far fa-gem",
          backgroundImage: "url('../bg.jpg')",
          color: "to right top, #F093FB, #F5576C",
        },
        {
          title: "Wardrobe2",
          title_en: "SWardrobe2",
          icon: "devicons devicons-terminal",
          color: "to top, #5EE7DF, #B490CA",
        },
      ];
    },
    searchedIcons: function () {
      const options = {
        threshold: 0.3,
        keys: ["name", "term"],
      };
      const fuse = new Fuse(icons, options);
      let result;
      if (!this.keyword) result = icons;
      else result = fuse.search(this.keyword);
      return result;
    },
    cssForPreview: function () {
      return {
        zoom: this.zoomPercentage + "%",
        /* iOSでもサイズが変わらないようにBulmaの指定を打ち消す */
        "-webkit-text-size-adjust": "auto",
      };
    },
    cssForScreenshotArea: function () {
      return {
        width: this.width + "px",
        height: this.height + "px",
        background: "linear-gradient(" + this.color + ")",
        fontFamily: this.font.fontFamily,
      };
    },
    cssForPhotoArea: function () {
      return {
        width: this.width + "px",
        height: this.height + "px",
        backgroundImage: "url(" + this.imageData + ")",
      };
    },
  },
  methods: {
    selectImage: function (e) {
      const files = e.target.files || e.dataTransfer.files;

      const reader = new FileReader();
      reader.onload = (ee) => {
        this.imageData = ee.target.result;
        e.target.value = "";
      };
      reader.readAsDataURL(files[0]);

      this.imageName = files[0].name;
    },
    removeImage: function () {
      this.imageData = "";
    },
    download: function () {
      if (this.isDownloading) return;
      this.isDownloading = true;
      let self = this;

      setTimeout(function () {
        html2canvas(document.querySelector("#screenshot-area"), {
          logging: false,
        }).then(function (canvas) {
          const dataUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = "output";
          a.click();
          self.isDownloading = false;
        });
      }, 100);
    },
    showSample: function (item) {
      this.title = item.title;
      this.title_en = item.title_en;
      this.icon = item.icon;
      this.color = item.color;
    },
    selectIcon: function (selectedIcon) {
      this.icon = selectedIcon;
    },
    selectGradient: function (selectedGradient) {
      this.color = selectedGradient;
    },
    selectFont: function (selectedFont) {
      this.font = selectedFont;
    },
  },
});
