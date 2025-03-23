document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expenses-form");
  const expenseList = document.getElementById("expenses-list");
  let pollingInterval = null;

  // Disable buttons in all list items except the active one.
  function disableOtherButtons(activeLi) {
    const lis = expenseList.querySelectorAll("li");
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

  // Load expenses from the backend.
  async function loadExpenses() {
    try {
      const expenses = await apiGet("/expenses");
      displayExpenses(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }

  // Display expenses in a styled list.
  function displayExpenses(expenses) {
    expenseList.innerHTML = "";
    expenses.forEach(expense => {
      const li = document.createElement("li");
      li.setAttribute("data-id", expense._id);

      let displayText = `Category: ${expense.category} - Description: ${expense.description} - Budgeted: $${expense.budgeted} - Actual: $${expense.actual}`;
      if (expense.recurring) displayText += ` - Recurring: Yes`;
      if (expense.paymentMethod) displayText += ` - Payment Method: ${expense.paymentMethod}`;
      if (expense.notes) displayText += ` - Notes: ${expense.notes}`;

      const span = document.createElement("span");
      span.textContent = displayText;
      li.appendChild(span);

      // Create a button group for actions.
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

      editButton.addEventListener("click", () => enterEditMode(li, expense));
      deleteButton.addEventListener("click", () => enterDeleteConfirmMode(li, expense._id));

      expenseList.appendChild(li);
    });
  }

  // Enter edit mode with a grid layout for inputs.
  function enterEditMode(li, expense) {
    clearInterval(pollingInterval);
    disableOtherButtons(li);
    li.innerHTML = "";

    // Create a grid container for edit fields.
    const editContainer = document.createElement("div");
    editContainer.style.display = "grid";
    editContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
    editContainer.style.gap = "10px";

    // Category input.
    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.value = expense.category;
    categoryInput.placeholder = "Category";
    editContainer.appendChild(categoryInput);

    // Description input.
    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.value = expense.description;
    descriptionInput.placeholder = "Description";
    editContainer.appendChild(descriptionInput);

    // Budgeted input.
    const budgetedInput = document.createElement("input");
    budgetedInput.type = "number";
    budgetedInput.value = expense.budgeted;
    budgetedInput.placeholder = "Budgeted ($)";
    editContainer.appendChild(budgetedInput);

    // Actual input.
    const actualInput = document.createElement("input");
    actualInput.type = "number";
    actualInput.value = expense.actual;
    actualInput.placeholder = "Actual ($)";
    editContainer.appendChild(actualInput);

    // Recurring input with label.
    const recurringContainer = document.createElement("div");
    recurringContainer.style.display = "flex";
    recurringContainer.style.alignItems = "center";
    const recurringLabel = document.createElement("label");
    recurringLabel.textContent = "Recurring:";
    recurringLabel.style.marginRight = "5px";
    const recurringInput = document.createElement("input");
    recurringInput.type = "checkbox";
    recurringInput.checked = expense.recurring || false;
    recurringContainer.appendChild(recurringLabel);
    recurringContainer.appendChild(recurringInput);
    editContainer.appendChild(recurringContainer);

    // Payment Method input.
    const paymentMethodInput = document.createElement("input");
    paymentMethodInput.type = "text";
    paymentMethodInput.placeholder = "Payment Method";
    paymentMethodInput.value = expense.paymentMethod || "";
    editContainer.appendChild(paymentMethodInput);

    // Notes input.
    const notesInput = document.createElement("input");
    notesInput.type = "text";
    notesInput.placeholder = "Notes";
    notesInput.value = expense.notes || "";
    editContainer.appendChild(notesInput);

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
      const updatedExpense = {
        category: categoryInput.value,
        description: descriptionInput.value,
        budgeted: parseFloat(budgetedInput.value),
        actual: parseFloat(actualInput.value),
        recurring: recurringInput.checked,
        paymentMethod: paymentMethodInput.value,
        notes: notesInput.value,
        dateUpdated: new Date()
      };

      try {
        await apiPut(`/expenses/${expense._id}`, updatedExpense);
        loadExpenses();
        pollingInterval = setInterval(loadExpenses, 1000);
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    });

    cancelButton.addEventListener("click", () => {
      loadExpenses();
      pollingInterval = setInterval(loadExpenses, 1000);
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
        await apiDelete(`/expenses/${id}`);
        loadExpenses();
        pollingInterval = setInterval(loadExpenses, 1000);
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    });

    cancelButton.addEventListener("click", () => {
      loadExpenses();
      pollingInterval = setInterval(loadExpenses, 1000);
    });
  }

  // Form submission to add a new expense entry.
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const budgeted = parseFloat(document.getElementById("budgeted").value);
    const actual = parseFloat(document.getElementById("actual").value);
    const recurring = document.getElementById("recurring").checked;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const notes = document.getElementById("notes").value;
    try {
      await apiPost("/expenses", { category, description, budgeted, actual, recurring, paymentMethod, notes });
      e.target.reset();
      loadExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  });

  loadExpenses();
  pollingInterval = setInterval(loadExpenses, 1000);
});
