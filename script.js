

// Global variable to track edit mode (null means no edit in progress)
 let editIndex = null;
    
 // Conversion functions for full-length Listening and Reading (Academic)
 function convertListeningScoreToBand(score) {
   score = parseInt(score, 10);
   if (isNaN(score)) return "";
   if (score >= 39) return "9";
   if (score >= 37) return "8.5";
   if (score >= 35) return "8";
   if (score >= 32) return "7.5";
   if (score >= 30) return "7";
   if (score >= 26) return "6.5";
   if (score >= 23) return "6";
   if (score >= 18) return "5.5";
   if (score >= 16) return "5";
   if (score >= 12) return "4.5";
   if (score >= 10) return "4";
   return "Below 4";
 }
 
 function convertReadingScoreToBand(score) {
   score = parseInt(score, 10);
   if (isNaN(score)) return "";
   if (score >= 39) return "9";
   if (score >= 37) return "8.5";
   if (score >= 35) return "8";
   if (score >= 33) return "7.5";
   if (score >= 30) return "7";
   if (score >= 26) return "6.5";
   if (score >= 23) return "6";
   if (score >= 18) return "5.5";
   if (score >= 16) return "5";
   if (score >= 10) return "4.5";
   return "Below 4.5";
 }
 
 // Update the Band field based on Section, Test Type, and Score
 function updateBand() {
   const section = document.getElementById("section").value;
   const testType = document.getElementById("testType").value;
   const score = document.getElementById("score").value;
   const bandInput = document.getElementById("band");
   
   // For Listening and Reading, auto-calculate band only if "Full Length" is selected
   if ((section === "Listening" || section === "Reading") && testType === "Full Length") {
     if (section === "Listening") {
       bandInput.value = convertListeningScoreToBand(score);
     } else if (section === "Reading") {
       bandInput.value = convertReadingScoreToBand(score);
     }
     bandInput.readOnly = true;
   } else {
     // For parts or for Writing/Speaking, allow manual band entry
     bandInput.readOnly = false;
     // Optionally, you can clear the auto-calculated value here:
     // bandInput.value = "";
   }
 }
 
 // Dynamically populate the "Test Type" options based on selected Section
 function updateTestTypeOptions(section) {
   const testTypeSelect = document.getElementById("testType");
   testTypeSelect.innerHTML = ""; // Clear existing options
   
   let defaultOption = document.createElement("option");
   defaultOption.value = "";
   defaultOption.textContent = "Select Test Type";
   testTypeSelect.appendChild(defaultOption);
   
   if (section === "Listening") {
     let options = [
       { value: "Full Length", text: "Full Length" },
       { value: "Part 1", text: "Part 1 (10 questions)" },
       { value: "Part 2", text: "Part 2 (10 questions)" },
       { value: "Part 3", text: "Part 3 (10 questions)" },
       { value: "Part 4", text: "Part 4 (10 questions)" }
     ];
     options.forEach(opt => {
       let option = document.createElement("option");
       option.value = opt.value;
       option.textContent = opt.text;
       testTypeSelect.appendChild(option);
     });
   } else if (section === "Reading") {
     let options = [
       { value: "Full Length", text: "Full Length" },
       { value: "Part 1", text: "Part 1 (13 questions)" },
       { value: "Part 2", text: "Part 2 (13 questions)" },
       { value: "Part 3", text: "Part 3 (14 questions)" }
     ];
     options.forEach(opt => {
       let option = document.createElement("option");
       option.value = opt.value;
       option.textContent = opt.text;
       testTypeSelect.appendChild(option);
     });
   } else if (section === "Writing") {
     let options = [
       { value: "Task 1", text: "Task 1" },
       { value: "Task 2", text: "Task 2" }
     ];
     options.forEach(opt => {
       let option = document.createElement("option");
       option.value = opt.value;
       option.textContent = opt.text;
       testTypeSelect.appendChild(option);
     });
   } else if (section === "Speaking") {
     let options = [
       { value: "Full Length", text: "Full Length" },
       { value: "Part 1", text: "Part 1" },
       { value: "Part 2", text: "Part 2" },
       { value: "Part 3", text: "Part 3" }
     ];
     options.forEach(opt => {
       let option = document.createElement("option");
       option.value = opt.value;
       option.textContent = opt.text;
       testTypeSelect.appendChild(option);
     });
   }
 }
 
 // Update fields when Section is changed
 function handleSectionChange() {
   const section = document.getElementById("section").value;
   updateTestTypeOptions(section);
   // Clear activity number until Test Type is chosen
   document.getElementById("activity").value = "";
   // Reset band to manual until test type selection triggers auto-calculation if applicable
   document.getElementById("band").readOnly = false;
 }
 
 // When Test Type changes, update Activity number and Band auto-calc if needed
 document.getElementById("testType").addEventListener("change", function() {
   updateBand();
   const section = document.getElementById("section").value;
   const testType = document.getElementById("testType").value;
   if (section && testType) {
     document.getElementById("activity").value = getNextActivityNumber(section, testType);
   } else {
     document.getElementById("activity").value = "";
   }
 });
 
 // Get the next activity number for the specific Section and Test Type
 function getNextActivityNumber(section, testType) {
   let entries = JSON.parse(localStorage.getItem("ieltsEntries")) || [];
   let count = entries.filter(entry => entry.section === section && entry.testType === testType).length;
   return count + 1;
 }
 
 // Clear only the entry-specific fields (but keep Date, Section, Test Type, and Test Name)
 function clearEntryFields() {
   document.getElementById("score").value = "";
   document.getElementById("band").value = "";
   document.querySelector('input[name="timeEntry"]').value = "11:00";
   document.querySelector('textarea[name="keyTakeaways"]').value = "";
   document.querySelector('textarea[name="areas"]').value = "";
   
   // Update activity number based on current Section and Test Type
   const section = document.getElementById("section").value;
   const testType = document.getElementById("testType").value;
   if (section && testType) {
     document.getElementById("activity").value = getNextActivityNumber(section, testType);
   }
 }
 
 // Save the entry to local storage and update the entries display
 document.getElementById("trackerForm").addEventListener("submit", function(e) {
   e.preventDefault();
   
   const date = document.querySelector('input[name="date"]').value;
   const section = document.getElementById("section").value;
   const testType = document.getElementById("testType").value;
   const testName = document.querySelector('input[name="testName"]').value;
   const activity = document.getElementById("activity").value;
   const timeEntry = document.querySelector('input[name="timeEntry"]').value;
   const score = document.getElementById("score").value;
   const band = document.getElementById("band").value;
   const keyTakeaways = document.querySelector('textarea[name="keyTakeaways"]').value;
   const areas = document.querySelector('textarea[name="areas"]').value;
   
   const entry = {
     date,
     section,
     testType,
     testName,
     activity,
     timeEntry,
     score,
     band,
     keyTakeaways,
     areas
   };
   
   let entries = JSON.parse(localStorage.getItem("ieltsEntries")) || [];
   
   // If we're editing an existing entry, update it; otherwise, push a new entry.
   if (editIndex !== null) {
     entries[editIndex] = entry;
     // Reset edit mode
     editIndex = null;
     document.getElementById("submitBtn").textContent = "Save Entry";
     document.getElementById("cancelEditBtn").style.display = "none";
   } else {
     entries.push(entry);
   }
   
   localStorage.setItem("ieltsEntries", JSON.stringify(entries));
   alert("Entry saved locally!");
   clearEntryFields();
   renderEntries();
 });
 
 // Render the saved entries in the table, grouping by date
 function renderEntries() {
   let entries = JSON.parse(localStorage.getItem("ieltsEntries")) || [];
   // Sort entries by date (and then by timeEntry)
   entries.sort((a, b) => {
     if(a.date === b.date) {
       return a.timeEntry.localeCompare(b.timeEntry);
     }
     return a.date.localeCompare(b.date);
   });
   
   const entriesBody = document.getElementById("entriesBody");
   entriesBody.innerHTML = "";
   
   let currentDate = "";
   entries.forEach((entry, i) => {
     // When the date changes, insert a grouping row
     if (entry.date !== currentDate) {
       currentDate = entry.date;
       const groupRow = document.createElement("tr");
       groupRow.classList.add("date-divider");
       groupRow.innerHTML = `<td colspan="11">Date: ${currentDate}</td>`;
       entriesBody.appendChild(groupRow);
     }
     
     const row = document.createElement("tr");
     row.innerHTML = `
       <td>${entry.date}</td>
       <td>${entry.section}</td>
       <td>${entry.testType}</td>
       <td>${entry.testName || ""}</td>
       <td>${entry.activity}</td>
       <td>${entry.timeEntry}</td>
       <td>${entry.score}</td>
       <td>${entry.band}</td>
       <td>${entry.keyTakeaways}</td>
       <td>${entry.areas}</td>
       <td>
         <button class="edit-btn" onclick="editEntry(${i})">Edit</button>
         <button class="delete-btn" onclick="deleteEntry(${i})">Delete</button>
       </td>
     `;
     entriesBody.appendChild(row);
   });
 }
 
 // Delete a specific entry and re-render the list
 function deleteEntry(index) {
   let entries = JSON.parse(localStorage.getItem("ieltsEntries")) || [];
   entries.splice(index, 1);
   localStorage.setItem("ieltsEntries", JSON.stringify(entries));
   renderEntries();
 }
 
 // Edit an entry: load its data into the form for updating
 function editEntry(index) {
   let entries = JSON.parse(localStorage.getItem("ieltsEntries")) || [];
   const entry = entries[index];
   
   document.querySelector('input[name="date"]').value = entry.date;
   document.getElementById("section").value = entry.section;
   updateTestTypeOptions(entry.section);
   document.getElementById("testType").value = entry.testType;
   document.getElementById("testName").value = entry.testName || "";
   document.getElementById("activity").value = entry.activity;
   document.querySelector('input[name="timeEntry"]').value = entry.timeEntry;
   document.getElementById("score").value = entry.score;
   document.getElementById("band").value = entry.band;
   document.querySelector('textarea[name="keyTakeaways"]').value = entry.keyTakeaways;
   document.querySelector('textarea[name="areas"]').value = entry.areas;
   
   editIndex = index;
   document.getElementById("submitBtn").textContent = "Update Entry";
   document.getElementById("cancelEditBtn").style.display = "inline-block";
 }
 
 // Cancel edit mode: clear the form and reset edit variables
 document.getElementById("cancelEditBtn").addEventListener("click", function() {
   clearEntryFields();
   editIndex = null;
   document.getElementById("submitBtn").textContent = "Save Entry";
   this.style.display = "none";
 });
 
 // Toggle showing/hiding the entries section
 document.getElementById("toggleEntriesBtn").addEventListener("click", function() {
   const entriesSection = document.getElementById("entriesSection");
   if (entriesSection.style.display === "none") {
     entriesSection.style.display = "block";
     this.textContent = "Hide Entries";
     renderEntries();
   } else {
     entriesSection.style.display = "none";
     this.textContent = "Show Entries";
   }
 });
 
 // Render entries on page load if the entries section is visible
 window.onload = function() {
   // if (document.getElementById("entriesSection").style.display !== "none") {
   //   renderEntries();
   // }
  renderEntries();
 }
