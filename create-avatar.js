function changeImage(type, img_url, outputId, folder) {
  const imgs = document.querySelectorAll(".output-img img");
  const selectedOption = Array.from(imgs).map((element) =>
    element.src.split("/").pop()
  );

  if (selectedOption.includes(img_url)) {
    document.getElementById(img_url).classList.remove("option-btn-selected");
    document
      .getElementById(outputId)
      .setAttribute("src", "/images/blank-img.png");
  } else {
    $(`#v-pills-${type} .option-btn`).removeClass("option-btn-selected");
    document.getElementById(img_url).classList.add("option-btn-selected");
    const fullImgUrl = `images/${folder}/${img_url}`;
    console.log(
      `change${type.charAt(0).toUpperCase() + type.slice(1)}`,
      fullImgUrl
    );
    document.getElementById(outputId).setAttribute("src", fullImgUrl);
    var d = new Date();
    document.getElementById(outputId).setAttribute("src", fullImgUrl);
    //   document.getElementById(outputId).setAttribute('src', fullImgUrl + "?t=" + d.getTime());
  }

  showOutputImage();
}

function changeBg(img_url) {
  changeImage("bg", img_url, "bg-output", "Background");
}
function changeWings(img_url) {
  changeImage("wings", img_url, "wings-output", "body-accessories");
}
function changeSkin(img_url) {
  changeImage("skin", img_url, "skin-output", "");
}
function changeExpression(img_url) {
  changeImage("expression", img_url, "expression-output", "expression");
}
function changeEyes(img_url) {
  changeImage("eyes", img_url, "eyes-output", "hand-accessories");
}
function changeDress(img_url) {
  changeImage("dress", img_url, "dress-output", "head-accessories");
}
function changeMask(img_url) {
  changeImage("mask", img_url, "mask-output", "");
}
function changeoutfit(img_url) {
  changeImage("Outfit", img_url, "hair-output", "Outfit");
}
function changeHorn(img_url) {
  changeImage("horn", img_url, "horn-output", "");
}
function changesidecharactor(img_url) {
  changeImage("side-characters", img_url, "wig-output", "side-characters");
}

function resetImages() {
  console.log("clicked");
  const imageIds = [
    "wig-output",
    "horn-output",
    "mask-output",
    "dress-output",
    "eyes-output",
    "wings-output",
    "hair-output",
    "bg-output",
  ];

  imageIds.forEach((id) => {
    document.getElementById(id).src = "/images/blank-img.png";
    console.log("reset", id);
  });

  showOutputImage();
}

document.getElementById("reset-button").addEventListener("click", resetImages);

function showOutputImage() {
  try {
    const imgs = document.querySelectorAll(".output-img img");
    console.log(imgs);
    let resEle = document.querySelector("canvas#combined-output-img");

    // Adjust opacity for images with class 'option-btn-selected'
    const selectedImgs = document.querySelectorAll(".option-btn-selected");
    selectedImgs.forEach((img) => (img.style.opacity = "0.5")); // Set to lower opacity

    // Ensure all images are loaded before drawing
    Promise.all(
      Array.from(imgs).map((img) => {
        if (img.complete) {
          return Promise.resolve();
        } else {
          return new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          });
        }
      })
    ).then(() => {
      var context = resEle.getContext("2d");
      resEle.width = imgs[0].width;
      resEle.height = imgs[0].height;

      // Clear the canvas before drawing
      context.clearRect(0, 0, resEle.width, resEle.height);

      // Draw images in the specified order
      const drawOrder = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
      drawOrder.forEach((index) => {
        if (imgs[index] && imgs[index].src !== "/images/blank-img.png") {
          context.drawImage(imgs[index], 0, 0);
        }
      });

      // Revert opacity after drawing
      selectedImgs.forEach((img) => (img.style.opacity = "1")); // Set back to normal opacity
    });
  } catch (e) {
    console.log(e);
  }
}

function download() {
  const element = document.getElementById("combined-output-img");

  // Create a larger canvas with the target resolution (1920x1920)
  html2canvas(element, {
    scale: 4, // Scale factor to increase the resolution
  }).then(function (canvas) {
    // Create a new canvas with fixed dimensions of 1920x1920
    const highResCanvas = document.createElement("canvas");
    const ctx = highResCanvas.getContext("2d");

    // Set fixed dimensions
    highResCanvas.width = 1920;
    highResCanvas.height = 1920;

    // Calculate the scaling needed to fit the original canvas into the high-res canvas
    const scale = Math.min(
      highResCanvas.width / canvas.width,
      highResCanvas.height / canvas.height
    );

    // Draw the scaled image onto the high-res canvas
    ctx.drawImage(canvas, 0, 0, canvas.width * scale, canvas.height * scale);

    // Save the high-res image
    saveCapture(highResCanvas.toDataURL("image/png"));
  });
}

function saveCapture(url) {
  var a = $("<a style='display:none' id='js-downloder'>")
    .attr("href", url)
    .attr("download", "Mellow Meme.png")
    .appendTo("body");

  a[0].click();

  a.remove();
}

document
  .getElementById("shareButton")
  .addEventListener("click", async function () {
    const canvas = document.getElementById("combined-output-img");
    const imageUrl = canvas.toDataURL("image/png").split(",")[1]; // Get base64 part of the URL

    // Show the loader
    document.getElementById("loader").style.display = "block";

    // Function to upload image to ImgBB
    async function uploadImage(imageData) {
      const apiKey = "769f593cfd23972896011a2231e5a01f"; // Replace with your ImgBB API key
      const formData = new FormData();
      formData.append("key", apiKey);
      formData.append("image", imageData);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.data.url;
    }

    try {
      const uploadedImageUrl = await uploadImage(imageUrl);
      const title =
        "Wow! How cool is this! Check out the Mellow Meme Maker https://www.furiesmellow0x69.com/mememaker";
      const description = "Link to the meme:";

      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title + " - " + description
      )}&url=${encodeURIComponent(uploadedImageUrl)}`;
      window.open(twitterUrl, "_blank");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      // Hide the loader
      document.getElementById("loader").style.display = "none";
    }
  });

document
  .getElementById("shareTelegramButton")
  .addEventListener("click", async function () {
    const canvas = document.getElementById("combined-output-img");
    const imageUrl = canvas.toDataURL("image/png").split(",")[1]; // Get base64 part of the URL

    // Show the loader
    document.getElementById("loader").style.display = "block";

    // Function to upload image to ImgBB
    async function uploadImage(imageData) {
      const apiKey = "769f593cfd23972896011a2231e5a01f"; // Replace with your ImgBB API key
      const formData = new FormData();
      formData.append("key", apiKey);
      formData.append("image", imageData);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.data.url;
    }

    try {
      const uploadedImageUrl = await uploadImage(imageUrl);
      const title =
        "Wow! How cool is this! Check out the Mellow Meme Maker https://www.furiesmellow0x69.com/mememaker";
      const description = "Link to the meme:";

      const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(
        title + " - " + description
      )}&url=${encodeURIComponent(uploadedImageUrl)}`;
      window.open(telegramUrl, "_blank");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      // Hide the loader
      document.getElementById("loader").style.display = "none";
    }
  });

// Initialize the canvas with the current state
showOutputImage();
setTimeout(showOutputImage, 1000);
