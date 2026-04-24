const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async () => {

  const input = document.getElementById("inputBox").value;

  const output = document.getElementById("output");

  const loading = document.getElementById("loading");

  try {

    loading.innerText = "Loading...";

    output.innerText = "";

    const parsedData = JSON.parse(input);

    const response = await fetch("https://srm-backend-5n30.onrender.com/bfhl", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        data: parsedData
      })
    });

    const result = await response.json();

    output.innerText = JSON.stringify(
      result,
      null,
      2
    );

  } catch (error) {

    output.innerText =
      "Error: " + error.message;

  } finally {

    loading.innerText = "";
  }

});