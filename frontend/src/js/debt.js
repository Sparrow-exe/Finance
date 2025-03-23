document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("debt-form");
  const debtList = document.getElementById("debt-list");
  let pollingInterval = null;

  // Disable buttons in all list items except the active one.
  function disableOtherButtons(activeLi) {
    const lis = debtList.querySelectorAll("li");
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

  // Load all debt entries from the backend.
  async function loadDebt() {
    try {
      const debts = await apiGet("/debt");
      displayDebts(debts);
    } catch (error) {
      console.error("Error fetching debts:", error);
    }
  }

  // Render the debt entries in a styled list.
  function displayDebts(debts) {
    debtList.innerHTML = "";
    debts.forEach(debt => {
      const li = document.createElement("li");
      li.setAttribute("data-id", debt._id);

      let displayText = `Name: ${debt.debtName} - Balance: $${debt.balance} - APR: ${debt.apr}% - Monthly Payment: $${debt.monthlyPayment}`;
      if (debt.type) displayText += ` - Type: ${debt.type}`;
      if (debt.dueDate) displayText += ` - Due Date: ${debt.dueDate}`;
      if (debt.minimumPayment != null) displayText += ` - Minimum Payment: $${debt.minimumPayment}`;
      if (debt.status) displayText += ` - Status: ${debt.status}`;

      const span = document.createElement("span");
      span.textContent = displayText;
      li.appendChild(span);

      // Create a button group for Edit and Delete actions.
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

      editButton.addEventListener("click", () => enterEditMode(li, debt));
      deleteButton.addEventListener("click", () => enterDeleteConfirmMode(li, debt._id));

      debtList.appendChild(li);
    });
  }

  // Enter edit mode for a specific debt entry.
  function enterEditMode(li, debt) {
    clearInterval(pollingInterval);
    disableOtherButtons(li);
    li.innerHTML = "";

    // Create a grid container for edit fields.
    const editContainer = document.createElement("div");
    editContainer.style.display = "grid";
    editContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
    editContainer.style.gap = "10px";

    // Debt Name input.
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = debt.debtName;
    nameInput.placeholder = "Debt Name";
    editContainer.appendChild(nameInput);

    // Balance input.
    const balanceInput = document.createElement("input");
    balanceInput.type = "number";
    balanceInput.value = debt.balance;
    balanceInput.placeholder = "Balance ($)";
    editContainer.appendChild(balanceInput);

    // APR input.
    const aprInput = document.createElement("input");
    aprInput.type = "number";
    aprInput.step = "0.01";
    aprInput.value = debt.apr;
    aprInput.placeholder = "APR (%)";
    editContainer.appendChild(aprInput);

    // Monthly Payment input.
    const paymentInput = document.createElement("input");
    paymentInput.type = "number";
    paymentInput.value = debt.monthlyPayment;
    paymentInput.placeholder = "Monthly Payment ($)";
    editContainer.appendChild(paymentInput);

    // Type input.
    const typeInput = document.createElement("input");
    typeInput.type = "text";
    typeInput.placeholder = "Type (e.g., credit card)";
    typeInput.value = debt.type || "";
    editContainer.appendChild(typeInput);

    // Due Date input.
    const dueDateInput = document.createElement("input");
    dueDateInput.type = "number";
    dueDateInput.min = "1";
    dueDateInput.max = "31";
    dueDateInput.placeholder = "Due Date (day)";
    dueDateInput.value = debt.dueDate || "";
    editContainer.appendChild(dueDateInput);

    // Minimum Payment input.
    const minPaymentInput = document.createElement("input");
    minPaymentInput.type = "number";
    minPaymentInput.step = "0.01";
    minPaymentInput.placeholder = "Minimum Payment ($)";
    minPaymentInput.value = debt.minimumPayment != null ? debt.minimumPayment : "";
    editContainer.appendChild(minPaymentInput);

    // Status input.
    const statusInput = document.createElement("input");
    statusInput.type = "text";
    statusInput.placeholder = "Status (e.g., active)";
    statusInput.value = debt.status || "";
    editContainer.appendChild(statusInput);

    li.appendChild(editContainer);

    // Create a button group for Save/Cancel.
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
      const updatedDebt = {
        debtName: nameInput.value,
        balance: parseFloat(balanceInput.value),
        apr: parseFloat(aprInput.value),
        monthlyPayment: parseFloat(paymentInput.value),
        type: typeInput.value,
        dueDate: dueDateInput.value ? parseInt(dueDateInput.value, 10) : null,
        minimumPayment: minPaymentInput.value ? parseFloat(minPaymentInput.value) : null,
        status: statusInput.value,
        dateUpdated: new Date()
      };

      try {
        await apiPut(`/debt/${debt._id}`, updatedDebt);
        loadDebt();
        pollingInterval = setInterval(loadDebt, 1000);
      } catch (error) {
        console.error("Error updating debt:", error);
      }
    });

    cancelButton.addEventListener("click", () => {
      loadDebt();
      pollingInterval = setInterval(loadDebt, 1000);
    });
  }

  // Enter delete confirmation mode with styled buttons.
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
        await apiDelete(`/debt/${id}`);
        loadDebt();
        pollingInterval = setInterval(loadDebt, 1000);
      } catch (error) {
        console.error("Error deleting debt:", error);
      }
    });

    cancelButton.addEventListener("click", () => {
      loadDebt();
      pollingInterval = setInterval(loadDebt, 1000);
    });
  }

  // Handle form submission to add a new debt entry.
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const debtName = document.getElementById("debtName").value;
    const balance = parseFloat(document.getElementById("balance").value);
    const apr = parseFloat(document.getElementById("apr").value);
    const monthlyPayment = parseFloat(document.getElementById("monthlyPayment").value);
    const type = document.getElementById("debtType").value;
    const dueDate = document.getElementById("dueDate").value;
    const minimumPayment = document.getElementById("minimumPayment").value;
    const status = document.getElementById("status").value;

    try {
      await apiPost("/debt", {
        debtName,
        balance,
        apr,
        monthlyPayment,
        type,
        dueDate: dueDate ? parseInt(dueDate, 10) : null,
        minimumPayment: minimumPayment ? parseFloat(minimumPayment) : null,
        status
      });
      e.target.reset();
      loadDebt();
    } catch (error) {
      console.error("Error adding debt:", error);
    }
  });

  // Initial load and start polling.
  loadDebt();
  pollingInterval = setInterval(loadDebt, 1000);
});
