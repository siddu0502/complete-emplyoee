document.addEventListener('DOMContentLoaded', function() {
    const emp_id = localStorage.getItem('employee_id','123')
    console.log(emp_id)
   fetch(`http://13.60.26.193:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById("name").innerText = data.name;
            document.getElementById("role").innerText = data.role;})
    // const formData = new FormData();

    // formData.append("aadhar_card", document.getElementById("aadhar").files[0]);
    // formData.append("pan_card", document.getElementById("pan").files[0]);
    // formData.append("resume", document.getElementById("resume").files[0]);

    // fetch(`http://127.0.0.1:8000/api/upload-documents/${emp_id}/`, {
    //     method: "POST",
    //     body: formData
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     alert(data.message);
    // })
    // .catch(error => {
    //     console.error("Error:", error);
    // });
    const documentstable = document.getElementById('table-documents')
    // fetch(`http://13.60.26.193:8000/api/employee-documents/${emp_id}/`)
    //     .then(res => res.json())
    //     .then(data => {
    //         documentstable.innerHTML = "";
    //         console.log(data)
    //         if (!data || data.length === 0) {
    //             documnets.innerHTML = `<tr><td colspan="4">No documnets found</td></tr>`;
    //             return;
    //         }

    //         data.forEach(p => {
    //             const row = document.createElement("tr");
    //             row.innerHTML = `
    //                 <td>${p.uploaded_at}</td>
    //                 <td>${p.doc_type}</td>
    //                 <td>${p.description}</td>
    //                 <td>${p.file}</td>
    //             `;
    //             documentstable.appendChild(row);
    //         });
    //     })
    //     .catch(err => {
    //         console.error("Error fetching payslips:", err);
    //         payslipTableBody.innerHTML = `<tr><td colspan="4">Error loading documents</td></tr>`;
    //     });

    // Select elements using the NEW UNIQUE IDs
    const docInput = document.getElementById('docFileInput');
    const docArea = document.getElementById('docDropArea');
    const docText = document.getElementById('docFileName');
    const docForm = document.getElementById('docUniqueUploadForm');

    // 1. Handle file selection via Click
    if(docInput) {
        docInput.addEventListener('change', function() {
            handleDocFiles(this.files);
        });
    }

    // 2. Handle Drag and Drop Visuals
    if(docArea) {
        // Drag Over
        docArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            docArea.style.borderColor = '#ff6b00';
            docArea.style.backgroundColor = '#fff8f0';
        });

        // Drag Leave
        docArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            docArea.style.borderColor = '#e0e0e0';
            docArea.style.backgroundColor = '#fafafa';
        });

        // Drop
        docArea.addEventListener('drop', (e) => {
            e.preventDefault();
            docArea.style.borderColor = '#e0e0e0';
            docArea.style.backgroundColor = '#fafafa';
            
            // Transfer files to input
            if(docInput) {
                docInput.files = e.dataTransfer.files;
                handleDocFiles(docInput.files);
            }
        });
    }

    // 3. Update Text Helper
    function handleDocFiles(files) {
        if (files.length > 0) {
            if (files.length === 1) {
                docText.textContent = files[0].name;
                docText.style.color = '#2c3e50'; // Dark text
            } else {
                docText.textContent = `${files.length} files ready to upload`;
                docText.style.color = '#2c3e50';
            }
        } else {
            docText.innerHTML = 'Click to browse';
            docText.style.color = '#ff6b00'; // Orange
        }
    }

    // 4. Form Submit Demo
    if(docForm) {
        docForm.addEventListener('submit', function(e) {
            e.preventDefault()
             
    const formData = new FormData();

    formData.append("doc_type", document.getElementById("docTypeSelect").value);
    formData.append("description", document.getElementById("docDescInput").value);
    formData.append("file", document.getElementById("docFileInput").files[0]);
    console.log(document.getElementById("docFileInput").files[0])
    fetch(`http://13.60.26.193:8000/api/upload-documents/${emp_id}/`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(result => {
        if(result.status === 201 || result.status === 200){
            console.log("Upload success:", result.body);
        } else {
            console.error("Upload failed:", result.body);
        }
    })
    .catch(error => console.error("Error:", error));

            ;
           
        });
    }
});