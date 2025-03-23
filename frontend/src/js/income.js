document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("income-form");
  const incomeList = document.getElementById("income-list");
  let pollingInterval = null;

  async function loadIncome() {
    try {
      const incomes = await apiGet("/income");
      displayIncome(incomes);
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  }

  function displayIncome(incomes) {
    incomeList.innerHTML = "";
    incomes.forEach((income) => {
      const li = document.createElement("li");
      li.setAttribute("data-id", income._id);

      let displayText = `Source: ${income.source}`;
      if (income.notes) displayText += ` - Notes: ${income.notes}`;
      if (income.frequency) displayText += ` - Frequency: ${income.frequency}`;
      if (income.category) displayText += ` - Category: ${income.category}`;
      if (income.payType) {
        displayText += ` - Pay Type: ${income.payType}`;
        if (income.payType === "hourly" && income.hourlyRate != null && income.hoursPerWeek != null) {
          const effectiveAnnual = income.hourlyRate * income.hoursPerWeek * 52;
          displayText += ` - Hourly Rate: $${income.hourlyRate} (Effective Annual: $${effectiveAnnual.toFixed(2)})`;
        } else if (income.payType === "salary" && income.annualSalary != null) {
          displayText += ` - Annual Salary: $${income.annualSalary}`;
        }
      }

      const span = document.createElement("span");
      span.textContent = displayText;
      li.appendChild(span);

      const btnGroup = document.createElement("div");
      btnGroup.classList.add("btn-group");

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("btn-edit");
      btnGroup.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn-delete");
      btnGroup.appendChild(deleteButton);

      li.appendChild(btnGroup);

      editButton.addEventListener("click", () => enterEditMode(li, income));
      deleteButton.addEventListener("click", () => enterDeleteConfirmMode(li, income._id));

      incomeList.appendChild(li);
    });
  }

  function disableOtherButtons(activeLi) {
    const lis = incomeList.querySelectorAll("li");
    lis.forEach(li => {
      if (li !== activeLi) {
        const buttons = li.querySelectorAll("button");
        buttons.forEach(btn => {
          btn.disabled = true;
          btn.style.opacity = 0.5;
        });
      }
    });
  }

  function enterEditMode(li, income) {
    clearInterval(pollingInterval);
    disableOtherButtons(li);
    li.innerHTML = "";

    const editContainer = document.createElement("div");
    editContainer.style.display = "grid";
    editContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
    editContainer.style.gap = "10px";

    // Standard fields.
    const sourceInput = document.createElement("input");
    sourceInput.type = "text";
    sourceInput.value = income.source;
    sourceInput.placeholder = "Source";
    editContainer.appendChild(sourceInput);

    const notesInput = document.createElement("input");
    notesInput.type = "text";
    notesInput.placeholder = "Notes";
    notesInput.value = income.notes || "";
    editContainer.appendChild(notesInput);

    const frequencyInput = document.createElement("input");
    frequencyInput.type = "text";
    frequencyInput.placeholder = "Frequency";
    frequencyInput.value = income.frequency || "";
    editContainer.appendChild(frequencyInput);

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "Category";
    categoryInput.value = income.category || "";
    editContainer.appendChild(categoryInput);

    // Pay Type Select.
    const payTypeSelect = document.createElement("select");
    const optionSalary = document.createElement("option");
    optionSalary.value = "salary";
    optionSalary.textContent = "Salary";
    const optionHourly = document.createElement("option");
    optionHourly.value = "hourly";
    optionHourly.textContent = "Hourly";
    payTypeSelect.appendChild(optionSalary);
    payTypeSelect.appendChild(optionHourly);
    payTypeSelect.value = income.payType || "salary";
    editContainer.appendChild(payTypeSelect);

    // Containers for conditional inputs.
    const salaryContainer = document.createElement("div");
    salaryContainer.id = "edit-salary-fields";
    salaryContainer.style.display = (payTypeSelect.value === "salary") ? "block" : "none";
    const annualSalaryInput = document.createElement("input");
    annualSalaryInput.type = "number";
    annualSalaryInput.placeholder = "Annual Salary ($)";
    annualSalaryInput.value = income.annualSalary || "";
    salaryContainer.appendChild(annualSalaryInput);
    editContainer.appendChild(salaryContainer);

    const hourlyContainer = document.createElement("div");
    hourlyContainer.id = "edit-hourly-fields";
    hourlyContainer.style.display = (payTypeSelect.value === "hourly") ? "block" : "none";
    const hourlyRateInput = document.createElement("input");
    hourlyRateInput.type = "number";
    hourlyRateInput.placeholder = "Hourly Rate ($)";
    hourlyRateInput.value = income.hourlyRate || "";
    hourlyContainer.appendChild(hourlyRateInput);
    // New: Hours per week input.
    const hoursPerWeekInput = document.createElement("input");
    hoursPerWeekInput.type = "number";
    hoursPerWeekInput.placeholder = "Hours per Week";
    hoursPerWeekInput.value = income.hoursPerWeek || 40;
    hourlyContainer.appendChild(hoursPerWeekInput);
    editContainer.appendChild(hourlyContainer);

    payTypeSelect.addEventListener("change", function () {
      if (this.value === "hourly") {
        salaryContainer.style.display = "none";
        hourlyContainer.style.display = "block";
      } else {
        salaryContainer.style.display = "block";
        hourlyContainer.style.display = "none";
      }
    });

    li.appendChild(editContainer);

    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.background = "#28a745";
    btnGroup.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.background = "#6c757d";
    btnGroup.appendChild(cancelButton);

    li.appendChild(btnGroup);

    saveButton.addEventListener("click", async () => {
      const updatedIncome = {
        source: sourceInput.value,
        notes: notesInput.value,
        frequency: frequencyInput.value,
        category: categoryInput.value,
        payType: payTypeSelect.value,
        // Use hourlyRate and hoursPerWeek if hourly; otherwise, annualSalary.
        hourlyRate: payTypeSelect.value === "hourly" ? parseFloat(hourlyRateInput.value) : null,
        hoursPerWeek: payTypeSelect.value === "hourly" ? parseFloat(hoursPerWeekInput.value) : null,
        annualSalary: payTypeSelect.value === "salary" ? parseFloat(annualSalaryInput.value) : null,
        dateUpdated: new Date()
      };

      try {
        await apiPut(`/income/${income._id}`, updatedIncome);
        loadIncome();
        pollingInterval = setInterval(loadIncome, 1000);
      } catch (error) {
        console.error("Error updating income:", error);
      }
    });

    cancelButton.addEventListener("click", () => {
      loadIncome();
      pollingInterval = setInterval(loadIncome, 1000);
    });
  }

  function enterDeleteConfirmMode(li, id) {
    clearInterval(pollingInterval);
    disableOtherButtons(li);
    li.innerHTML = "Are you sure? ";

    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Yes, Delete";
    confirmButton.style.background = "#dc3545";
    btnGroup.appendChild(confirmButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.background = "#6c757d";
    btnGroup.appendChild(cancelButton);

    li.appendChild(btnGroup);

    confirmButton.addEventListener("click", async () => {
      try {
        await apiDelete(`/income/${id}`);
        loadIncome();
        pollingInterval = setInterval(loadIncome, 1000);
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    });

    cancelButton.addEventListener("click", () => {
      loadIncome();
      pollingInterval = setInterval(loadIncome, 1000);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const source = document.getElementById("source").value;
    const notes = document.getElementById("notes").value;
    const frequency = document.getElementById("frequency").value;
    const category = document.getElementById("category").value;
    const payType = document.getElementById("payType").value;
    let hourlyRate = null;
    let hoursPerWeek = null;
    let annualSalary = null;
    if (payType === "hourly") {
      hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
      hoursPerWeek = parseFloat(document.getElementById("hoursPerWeek").value);
    } else {
      annualSalary = parseFloat(document.getElementById("annualSalary").value);
    }
    try {
      await apiPost("/income", { source, notes, frequency, category, payType, hourlyRate, hoursPerWeek, annualSalary });
      e.target.reset();
      loadIncome();
    } catch (error) {
      console.error("Error adding income:", error);
    }
  });

  loadIncome();
  pollingInterval = setInterval(loadIncome, 1000);
});
