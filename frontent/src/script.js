document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("income-form");
  const incomeList = document.getElementById("income-list");

  // Function to load income data from the backend
  async function loadIncome() {
    try {
      const response = await fetch('http://localhost:3000/income');
      if (!response.ok) {
        throw new Error('Failed to fetch income data');
      }
      const incomes = await response.json();
      displayIncome(incomes);
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  }

  // Render income data on the page with Edit and Delete options
  function displayIncome(incomes) {
    incomeList.innerHTML = '';
    incomes.forEach(income => {
      const li = document.createElement("li");
      li.setAttribute("data-id", income._id);

      const span = document.createElement("span");
      span.textContent = `Source: ${income.source} - Amount: $${income.amount}`;
      if (income.notes) {
        span.textContent += ` - Notes: ${income.notes}`;
      }
      li.appendChild(span);

      // Edit Button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      li.appendChild(editButton);

      // Delete Button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      li.appendChild(deleteButton);

      // Event listeners for Edit and Delete actions
      editButton.addEventListener("click", () => enterEditMode(li, income));
      deleteButton.addEventListener("click", () => enterDeleteConfirmMode(li, income._id));

      incomeList.appendChild(li);
    });
  }

  // Edit mode: replace display with inputs and cancel/save buttons
  function enterEditMode(li, income) {
    li.innerHTML = ""; // Clear existing content

    // Input for source (name)
    const sourceInput = document.createElement("input");
    sourceInput.type = "text";
    sourceInput.value = income.source;
    li.appendChild(sourceInput);

    // Input for amount
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.value = income.amount;
    li.appendChild(amountInput);

    // Input for notes (optional)
    const notesInput = document.createElement("input");
    notesInput.type = "text";
    notesInput.placeholder = "Notes";
    notesInput.value = income.notes || "";
    li.appendChild(notesInput);

    // Save Button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    li.appendChild(saveButton);

    // Cancel Button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    li.appendChild(cancelButton);

    saveButton.addEventListener("click", async () => {
      // Prepare the updated income data
      const updatedIncome = {
        source: sourceInput.value,
        amount: parseFloat(amountInput.value),
        notes: notesInput.value,
        dateUpdated: new Date()
      };

      try {
        const response = await fetch(`http://localhost:3000/income/${income._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedIncome)
        });
        if (!response.ok) {
          throw new Error("Failed to update income");
        }
        loadIncome(); // Reload list after update
      } catch (error) {
        console.error("Error updating income:", error);
      }
    });

    cancelButton.addEventListener("click", () => loadIncome());
  }

  // Delete confirmation mode: ask user to confirm deletion
  function enterDeleteConfirmMode(li, id) {
    li.innerHTML = "Are you sure? ";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Yes, Delete";
    li.appendChild(confirmButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    li.appendChild(cancelButton);

    confirmButton.addEventListener("click", async () => {
      try {
        const response = await fetch(`http://localhost:3000/income/${id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Failed to delete income");
        }
        loadIncome(); // Reload list after deletion
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    });

    cancelButton.addEventListener("click", () => loadIncome());
  }

  // Handle form submission to add new income
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const source = document.getElementById("source").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const notes = document.getElementById("notes") ? document.getElementById("notes").value : "";
    try {
      const response = await fetch('http://localhost:3000/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, amount, notes })
      });
      if (!response.ok) {
        throw new Error('Failed to add income');
      }
      form.reset();
      loadIncome();
    } catch (error) {
      console.error("Error adding income:", error);
    }
  });

  // Initial load of income data
  loadIncome();
// Poll the server every 1 second for updates
setInterval(loadIncome, 1000);

});
