"use strict"

document.addEventListener('DOMContentLoaded', function () {
    drivers()
    function drivers(){    
        const url = "https://66794a9318a459f6394f0cf7.mockapi.io/drivers";
        let constructedUrl = new URL(url);
        let id_current = 0; 
        const driversTable = document.querySelector(".standings_table_body");
        const status = document.querySelector(".status_text");
        const addBtn = document.querySelector(".btn_add");
        const randomAddBtn = document.querySelector(".btn_add_random");
        addBtn.addEventListener("click", addStandingInputGroup);
        randomAddBtn.addEventListener("click", addRandomDriver);
        
        getDrivers();
        
        function addStandingInputGroup(){
            disableButtons();
            driversTable.innerHTML += 
            `<tr>
                <td data-label="fullName"><input type="text"   id="fullName_TI" name="fullName" value=""  required></td>
                <td data-label="team"> <input type="text"  id="team_TI"  name="team"  value=""  required</td>
                <td data-label="country">   <input type="text" id="country_TI"    name="country"    value="" required> </td>
                <td data-label="points">  <input type="number" id="points_TI"   name="points"   value="0" required min="0"> </td>
                <td data-label="Actions">
                    <button class="btn_standing btn_ok">O</button>
                    &nbsp; 
                    <button class="btn_standing btn_cancel">X</button>
                </td>
            </tr> `;
            status.innerHTML = "";
            const btnCancel = document.querySelector(".btn_cancel");
            btnCancel.addEventListener("click", getDrivers);
            const btnOk = document.querySelector(".btn_ok");
            btnOk.addEventListener("click", newDriver);
        }
    
        
        function addEditBtn(){
            const editBtn = document.querySelectorAll(".btn_edit");
            editBtn.forEach(btn => {
                btn.addEventListener("click", () => {
                    let tr = btn.parentNode.parentNode;
                    disableButtons();
                    let nodes = tr.getElementsByTagName('td');
                    let fullName = nodes[0].textContent; 
                    let team  = nodes[1].textContent;
                    let country    = nodes[2].textContent; 
                    let points   = nodes[3].textContent;
                    id_current = tr.getAttribute("current_id");
                    let htmlSnippet = 
                    `
                        <td data-label="Name"><input type="text"   id="fullName_TI" name="fullName" value="${fullName}" required</td>
                        <td data-label="Team"> <input type="text"  id="team_TI"  name="team"  value="${team}"  required</td>
                        <td data-label="Country">   <input type="text" id="country_TI"    name="country"    value="${country}"    required</td>
                        <td data-label="Points">  <input type="number" id="points_TI"   name="points"   value="${points}"   required min="0"</td>
                        <td data-label="Actions">
                            <button class="btn_standing btn_ok">O</button>
                            &nbsp; 
                            <button class="btn_standing btn_cancel">X</button>
                        </td>
                    `;
                    tr.innerHTML = htmlSnippet;
                    status.innerHTML = "";
                    const btnCancel = document.querySelector(".btn_cancel");
                    btnCancel.addEventListener("click", getDrivers);
                    const btnOk = document.querySelector(".btn_ok");
                    btnOk.addEventListener("click", putDriver);
                })
            });
        }

        function addDeleteBtn(){
            const deletebtn = document.querySelectorAll(".btn_delete");
            deletebtn.forEach(btn => {
                btn.addEventListener("click", () => {
                    let tr = btn.parentNode.parentNode;
                    id_current = tr.getAttribute("current_id");
                    deleteDriver();
                })
            });
        }
        
        function disableButtons(){
            const btns = document.querySelectorAll(".btn_standing");
            btns.forEach(btn => {
                btn.disabled = true;
            });
        }

        async function getDrivers(){
            driversTable.innerHTML = "";
            
            try {
                let res = await fetch(constructedUrl);
                if (!res.ok) {
                    status.innerHTML = "Error at fetching data";
                    console.log(res);
                    return;
                }

                let json = await res.json()
                json.sort((a, b) => parseInt(b.points) - parseInt(a.points));

                for (const drivers of json) {
                    driversTable.innerHTML += 
                    `
                        <tr current_id="${drivers.id}">
                            <td data-label="Name">${drivers.fullName}</td>
                            <td data-label="Team">${drivers.team}</td>
                            <td data-label="Country">${drivers.country}</td>
                            <td data-label="Points">${drivers.points}</td>
                            <td data-label="Actions">
                                <button class="btn_standing btn_edit">-</button>
                                &nbsp; 
                                <button class="btn_standing btn_delete">X</button>
                            </td>
                        </tr>
                    `;
                }
                addEditBtn();
                addDeleteBtn();
            } catch (error) {
                console.log(error);
                status.innerHTML = "Server Error: " + error;
            }
        
            addBtn.disabled = false;
            randomAddBtn.disabled = false;
        }


        async function addRandomDriver(){
            let driver = {
                "fullName": generateRandomName(),
                "team": generateRandomTeam(),
                "country": generateRandomCountry(), 
                "points": generateRandomPoints()
            }
            await postDriver(driver);
            await getDrivers();
        }
        
        async function newDriver(){
            let fullName = document.querySelector("#fullName_TI").value;
            let team  = document.querySelector("#team_TI").value;
            let country    = document.querySelector("#country_TI").value;
            let points   = document.querySelector("#points_TI").value;
        
            let driver = {
                "fullName": fullName,
                "team": team,
                "country": country, 
                "points": points
            }
            await postDriver(driver);
        } 

        async function postDriver(driver){
            try{
                let res = await fetch(url, {
                    "method"    : "POST", 
                    "headers"   : {"Content-type": "application/json"},
                    "body"      : JSON.stringify(driver)
                });
                if (res.status === 201) {
                    status.innerHTML = "Row Created";
                    await getDrivers();
                } 
                else 
                    status.innerHTML = "Error at creating row: " + res.status;
            } catch (error) {
                console.log(error);
                status.innerHTML = "Server Error:" + error;
            }
        }
        
        async function deleteDriver() {
            try{
                let res = await fetch(`${url}/${id_current}`, {
                    "method"    : "DELETE"
                });
                if (res.status === 200) {
                    status.innerHTML = "Row deleted";
                    await getDrivers();
                } 
                else 
                    status.innerHTML = "Error at deleting row: " + res.status;
            } catch (error) {
                console.log(error);
                status.innerHTML = "Server Error:" + error;
            }
        }

        async function putDriver(){

            let fullName = document.querySelector("#fullName_TI").value;
            let team  = document.querySelector("#team_TI").value;
            let country    = document.querySelector("#country_TI").value;
            let points   = document.querySelector("#points_TI").value;
        
            let driver = {
                "fullName": fullName,
                "team": team,
                "country": country, 
                "points": points
            }

            try{
                let res = await fetch(`${url}/${id_current}`, {
                    "method"    : "PUT", 
                    "headers"   : {"Content-type": "application/json"},
                    "body"      : JSON.stringify(driver)
                });

                if (res.status === 200) {
                    status.innerHTML = "Row updated";
                    await getDrivers();
                } else 
                    status.innerHTML = "Error at updating Row: " + res.status;
            } catch (error) {
                console.log(error);
                status.innerHTML = "Server error:" + error;
            }
        }

        function generateRandomName() {
            const namesArray = [
                "Elijah",
                "Olivia",
                "Liam",
                "Emma",
                "Noah",
                "Ava",
                "William",
                "Sophia",
                "James",
                "Isabella",
                "Benjamin",
                "Mia",
                "Lucas",
                "Amelia",
                "Henry",
                "Charlotte",
                "Alexander",
                "Harper",
                "Michael",
                "Evelyn",
                "Ethan",
                "Abigail",
                "Daniel",
                "Emily",
                "Jacob",
                "Madison",
                "Matthew",
                "Elizabeth",
                "Logan",
                "Avery"
            ];
                
            const surenamesArray = [
                "Smith",
                "Johnson",
                "Williams",
                "Brown",
                "Jones",
                "Miller",
                "Davis",
                "Garcia",
                "Rodriguez",
                "Wilson",
                "Martinez",
                "Anderson",
                "Taylor",
                "Thomas",
                "Hernandez",
                "Moore",
                "Martin",
                "Jackson",
                "Thompson",
                "White",
                "Lopez",
                "Lee",
                "Gonzalez",
                "Harris",
                "Clark",
                "Lewis",
                "Robinson",
                "Walker",
                "Perez"
            ];

            const randomNameIndex = Math.floor(Math.random() * namesArray.length);
            const randomSurenameIndex = Math.floor(Math.random() * surenamesArray.length);
            const randomName = namesArray[randomNameIndex];
            const randomSurename = surenamesArray[randomSurenameIndex];
            return `${randomName} ${randomSurename}`;
        }
            
        function generateRandomTeam(){
            const teamsArray = [
                "Swift Racers",
                "Velocity Team",
                "Thundercats",
                "Star Racing",
                "Blaze Crew",
                "Nitro Squad",
                "Apex Racers",
                "Turbo Tigers",
                "Flash Team",
                "Zoom Racers"
                ];
            const randomTeamIndex = Math.floor(Math.random() * teamsArray.length);
            const randomTeam = teamsArray[randomTeamIndex];
            return `${randomTeam}`;
        }
            
        function generateRandomCountry(){
            const countriesArray = [
                "Argentina",
                "United States",
                "Canada",
                "Brazil",
                "United Kingdom",
                "France",
                "Germany",
                "Italy",
                "Spain",
                "Russia",
                "China",
                "Japan",
                "Australia",
                "India",
                "South Africa",
                "Mexico",
                "Argentina",
                "Saudi Arabia",
                "South Korea",
                "Egypt"
                ]
            const randomCountryIndex = Math.floor(Math.random() * countriesArray.length);
            const randomCountry = countriesArray[randomCountryIndex];
            return `${randomCountry}`;
        }
            
        function generateRandomPoints() {
            return Math.floor(Math.random() * 501);
        }

    }
})






  