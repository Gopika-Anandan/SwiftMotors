let jsonData = [];

fetch('assets/dataset.xlsx')
.then(res => res.arrayBuffer())
.then(data => {
    const workbook = XLSX.read(data, {type:'array'});
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    jsonData = XLSX.utils.sheet_to_json(firstSheet);

    initFilters();
    createSalesChart();
    createDefectChart();
})
.catch(err => console.error(err));

/* Filters */
const monthFilter = document.getElementById('monthFilter');
const defectFilter = document.getElementById('defectFilter');

/* Charts */
let salesChart, defectChart;

function initFilters(){
    // Month filter
    const months = [...new Set(jsonData.map(d => d.Month))];
    months.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.text = m;
        monthFilter.appendChild(option);
    });

    // Defect filter
    const defectTypes = [...new Set(jsonData.map(d => d['Defect Type']))];
    defectTypes.forEach(d => {
        const option = document.createElement('option');
        option.value = d;
        option.text = d;
        defectFilter.appendChild(option);
    });

    monthFilter.addEventListener('change', updateSalesChart);
    defectFilter.addEventListener('change', updateDefectChart);
}

/* Sales Chart */
function createSalesChart(){
    const ctx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(ctx, {
        type: 'bar',
        data: getSalesData('All'),
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Monthly Sales' } }
        }
    });
}

function getSalesData(selectedMonth){
    let filtered = jsonData;
    if(selectedMonth !== "All") filtered = jsonData.filter(d => d.Month === selectedMonth);

    return {
        labels: filtered.map(d => d.Month),
        datasets: [{
            label: 'Units Sold',
            data: filtered.map(d => d['Units Sold']),
            backgroundColor: 'rgba(59,130,246,0.5)',
            borderColor: 'rgba(59,130,246,1)',
            borderWidth: 1
        }]
    };
}

function updateSalesChart(){
    const selected = monthFilter.value;
    salesChart.data = getSalesData(selected);
    salesChart.update();
}

/* Defect Chart */
function createDefectChart(){
    const ctx = document.getElementById('defectChart').getContext('2d');
    defectChart = new Chart(ctx, {
        type: 'bar',
        data: getDefectData('All'),
        options: { responsive: true, plugins: { title: { display: true, text: 'Defect Types' } } }
    });
}

function getDefectData(selectedDefect){
    let defectTypes = [...new Set(jsonData.map(d => d['Defect Type']))];
    if(selectedDefect !== "All") defectTypes = [selectedDefect];

    return {
        labels: defectTypes,
        datasets: [{
            label: 'Units Defective',
            data: defectTypes.map(d => 
                jsonData.filter(x => x['Defect Type'] === d).reduce((sum,x)=>sum+x['Units Defective'],0)
            ),
            backgroundColor: 'rgba(255,99,132,0.5)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
        }]
    };
}

function updateDefectChart(){
    const selected = defectFilter.value;
    defectChart.data = getDefectData(selected);
    defectChart.update();
}
