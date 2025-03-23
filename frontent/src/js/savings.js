document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("savings-form");
  const savingsList = document.getElementById("savings-list");
  let pollingInterval = null;

  // Load all savings entries
  async function loadSavings() {
    try {
      const savingsArr = await apiGet("/savings");
      displaySavings(savingsArr);
    } catch (error) {
      console.error("Error fetching savings:", error);
    }
  }

  function displaySavings(savingsArr) {
    savingsList.innerHTML = "";
    savingsArr.forEach(savings => {
      const li = document.createElement("li");
      li.setAttribute("data-id", savings._id);

      let displayText = `Name: ${savings.savingsName} - Balance: $${savings.currentBalance} - Interest Rate: ${savings.interestRate}% - Monthly Contribution: $${savings.monthlyContribution}`;
      if (savings.goalAmount) displayText += ` - Goal Amount: $${savings.goalAmount}`;
      if (savings.goalDate) {
        const goalDateStr = new Date(savings.goalDate).toLocaleDateString();
        displayText += ` - Goal Date: ${goalDateStr}`;
      }
      if (savings.type) displayText += ` - Type: ${savings.type}`;
      if (savings.compoundPeriod) displayText += ` - Compounds: ${savings.compoundPeriod}`;
      
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

      editButton.addEventListener("click", () => enterEditMode(li, savings));
      deleteButton.addEventListener("click", () => enterDeleteConfirmMode(li, savings._id));

      savingsList.appendChild(li);
    });
  }

  function disableOtherButtons(activeLi) {
    const lis = savingsList.querySelectorAll("li");
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

  function enterEditMode(li, savings) {
    clearInterval(pollingInterval);
    disableOtherButtons(li);
    li.innerHTML = "";

    const editContainer = document.createElement("div");
    editContainer.style.display = "grid";
    editContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
    editContainer.style.gap = "10px";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Savings Name";
    nameInput.value = savings.savingsName;
    editContainer.appendChild(nameInput);

    const balanceInput = document.createElement("input");
    balanceInput.type = "number";
    balanceInput.placeholder = "Current Balance ($)";
    balanceInput.value = savings.currentBalance;
    editContainer.appendChild(balanceInput);

    const rateInput = document.createElement("input");
    rateInput.type = "number";
    rateInput.step = "0.01";
    rateInput.placeholder = "Interest Rate (%)";
    rateInput.value = savings.interestRate;
    editContainer.appendChild(rateInput);

    const contributionInput = document.createElement("input");
    contributionInput.type = "number";
    contributionInput.placeholder = "Monthly Contribution ($)";
    contributionInput.value = savings.monthlyContribution;
    editContainer.appendChild(contributionInput);

    const goalAmountInput = document.createElement("input");
    goalAmountInput.type = "number";
    goalAmountInput.placeholder = "Goal Amount ($)";
    goalAmountInput.value = savings.goalAmount || "";
    editContainer.appendChild(goalAmountInput);

    const goalDateInput = document.createElement("input");
    goalDateInput.type = "date";
    if (savings.goalDate) {
      goalDateInput.value = new Date(savings.goalDate).toISOString().split("T")[0];
    }
    editContainer.appendChild(goalDateInput);

    const typeInput = document.createElement("input");
    typeInput.type = "text";
    typeInput.placeholder = "Type (e.g., emergency)";
    typeInput.value = savings.type || "";
    editContainer.appendChild(typeInput);

    // New: Compound Period select.
    const compoundSelect = document.createElement("select");
    const optionAnnually = document.createElement("option");
    optionAnnually.value = "annually";
    optionAnnually.textContent = "Annually";
    const optionQuarterly = document.createElement("option");
    optionQuarterly.value = "quarterly";
    optionQuarterly.textContent = "Quarterly";
    const optionMonthly = document.createElement("option");
    optionMonthly.value = "monthly";
    optionMonthly.textContent = "Monthly";
    compoundSelect.appendChild(optionAnnually);
    compoundSelect.appendChild(optionQuarterly);
    compoundSelect.appendChild(optionMonthly);
    compoundSelect.value = savings.compoundPeriod || "annually";
    editContainer.appendChild(compoundSelect);

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
      const updatedSavings = {
        savingsName: nameInput.value,
        currentBalance: parseFloat(balanceInput.value),
        interestRate: parseFloat(rateInput.value),
        monthlyContribution: parseFloat(contributionInput.value),
        goalAmount: goalAmountInput.value ? parseFloat(goalAmountInput.value) : null,
        goalDate: goalDateInput.value ? new Date(goalDateInput.value) : null,
        type: typeInput.value,
        compoundPeriod: compoundSelect.value,
        dateUpdated: new Date()
      };

      try {
        await apiPut(`/savings/${savings._id}`, updatedSavings);
        loadSavings();
        pollingInterval = setInterval(loadSavings, 1000);
      } catch (error) {
        console.error("Error updating savings:", error);
      }
    });

    cancelButton.addEventListener("click", () => {
      loadSavings();
      pollingInterval = setInterval(loadSavings, 1000);
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
        await apiDelete(`/savings/${id}`);
        loadSavings();
        pollingInterval = setInterval(loadSavings, 1000);
      } catch (error) {
        console.error("Error deleting savings:", error);
      }
    });

    cancelButton.addEventListener("click", () => {
      loadSavings();
      pollingInterval = setInterval(loadSavings, 1000);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const savingsName = document.getElementById("savingsName").value;
    const currentBalance = parseFloat(document.getElementById("currentBalance").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value);
    const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value);
    const goalAmount = document.getElementById("goalAmount").value;
    const goalDate = document.getElementById("goalDate").value;
    const type = document.getElementById("savingsType").value;
    const compoundPeriod = document.getElementById("compoundPeriod").value;
    try {
      await apiPost("/savings", {
        savingsName,
        currentBalance,
        interestRate,
        monthlyContribution,
        goalAmount: goalAmount ? parseFloat(goalAmount) : null,
        goalDate: goalDate ? new Date(goalDate) : null,
        type,
        compoundPeriod
      });
      e.target.reset();
      loadSavings();
    } catch (error) {
      console.error("Error adding savings:", error);
    }
  });

  loadSavings();
  pollingInterval = setInterval(loadSavings, 1000);
});
