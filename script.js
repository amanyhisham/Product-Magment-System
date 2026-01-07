let title=document.getElementById('title');
let price=document.getElementById('price');
let taxes=document.getElementById('taxes'); 
let ads=document.getElementById('ads');
let discount=document.getElementById('discount');
let total=document.getElementById('total');
let count=document.getElementById('count');
let category=document.getElementById('category');
let submit=document.getElementById('submit');
let mood='create';
let tmp;
//funcation get total
function getTotal(){
    if(price.value !=''){
        let result=(+price.value + +taxes.value + +ads.value)- +discount.value;
        total.innerHTML=result;
        total.style.background='#040';
    }else{
        total.innerHTML='';
        total.style.background='#a00d02';
    }   
}
//create product
function validateInputs(){
    if(title.value.trim() === ''){
        Swal.fire('Error','Product Name is required','error');
        title.focus();
        return false;
    }

    // تحقق من القيم الرقمية
    const numFields = [
        {el: price, name: 'Price'},
        {el: taxes, name: 'Taxes'},
        {el: ads, name: 'Ads'},
        {el: discount, name: 'Discount'}
    ];

    for(let field of numFields){
        if(field.el.value === '' || Number(field.el.value) < 0){
            Swal.fire('Error', `${field.name} must be 0 or more`, 'error');
            field.el.focus();
            return false;
        }
    }

    // Count فقط عند الإنشاء
    if(mood === 'create'){
        if(count.value === '' || Number(count.value) < 1){
            Swal.fire('Error','Count must be 1 or more','error');
            count.focus();
            return false;
        }
    }

    if(category.value.trim() === ''){
        Swal.fire('Error','Category is required','error');
        category.focus();
        return false;
    }

    return true;
}

//creat Product
let dataPro;
//get data from localstorage
if(localStorage.product != null){
    dataPro=JSON.parse(localStorage.product);
}else{
    dataPro=[];
}
submit.onclick=function(){
    if(!validateInputs()) return;
    let newPro={
        title:title.value.toLowerCase(),
        price:price.value,
        taxes:taxes.value,
        ads:ads.value,
        discount:discount.value,
        total:total.innerHTML,
        count:count.value,
        category:category.value.toLowerCase()
    }
 // ✅ CREATE
    if (mood === 'create') {

        // تحقق من count بس في create
        if (+newPro.count < 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'Count must be 1 or more'
            });
            return;
        }

        for (let i = 0; i < newPro.count; i++) {
            dataPro.push(newPro);
        }

    } 
    // ✅ UPDATE
    else {
        dataPro[tmp] = newPro;
        mood = 'create';
        submit.innerHTML = 'Create';
        count.style.display = 'block';
    }

localStorage.setItem('product',JSON.stringify(dataPro));
clearData();
showData();
getTotal();

}
 //clear inputs
 function clearData(){
    title.value='';
    price.value='';
    taxes.value='';
    ads.value='';
    discount.value='';
    total.innerHTML='';
    count.value='';
    category.value='';
 }  
 //read data
 function showData(){
    let table='';
    for(let i=0;i<dataPro.length;i++){
        table+=`
        <tr>
        <td>${i+1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button  onclick='updateProduct(${i})'>Update</button></td>
        <td><button   onclick='deleteProduct(${i})'>Delete</button></td>
        </tr>`;
    }
    if(dataPro.length>0){
        document.getElementById('deletAll').innerHTML=`<button onclick='deleteAll()'>Delete All (${dataPro.length})</button>`;   
    }
    document.getElementById('table-body').innerHTML=table;
 }
 showData();
//delete for one
function deleteProduct(i){
 Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete "${dataPro[i].title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        background: '#1a1a1a',
        color: '#fff',
        iconColor: '#ffa500'
    }).then((result) => {
        if (result.isConfirmed) {
            //ok want delete
            dataPro.splice(i,1);
            localStorage.setItem('product', JSON.stringify(dataPro));
            showData();
            Swal.fire({
                title: 'Deleted!',
                text: 'Product has been deleted.',
                icon: 'success',
                confirmButtonColor: '#390053',
                background: '#1a1a1a',
                color: '#fff',
                iconColor: '#ffa500'
            });
        }
    });

    }
//delet all
function deleteAll(){
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete all products?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete all!',
        background: '#1a1a1a',
        color: '#fff',
        iconColor: '#ffa500'
    }).then((result) => {
        if(result.isConfirmed){
            //ok want delete all
            localStorage.clear();
            dataPro.splice(0);
            showData();
            document.getElementById('deletAll').innerHTML = '';
            //alert sucess delet
            Swal.fire({
                title: 'Deleted!',
                text: 'All products have been deleted.',
                icon: 'success',
                confirmButtonColor: '#390053',
                background: '#1a1a1a',
                color: '#fff',
                iconColor: '#ffa500'
            });
        }
    });
}
//update
function updateProduct(i){
    //رفع للبيانات لامكانيه تعديل
    title.value=dataPro[i].title;
    price.value=dataPro[i].price;
    taxes.value=dataPro[i].taxes;
    ads.value=dataPro[i].ads;
    discount.value=dataPro[i].discount;
    getTotal();
    category.value=dataPro[i].category;
    count.style.display='none';
    submit.innerHTML='Update';
    mood='update';
    tmp=i;
    scroll({
        top:0,
        behavior:"smooth"
    }); 

  
}
//search
let moodsearch = 'title'; // default search
function getsearchmood(id){
    let search = document.getElementById('search'); // لازم تتعرف الأول
    if(id === 'searchTitle'){
        moodsearch = 'title';
        search.placeholder = 'Search By Title';
    } else {
        moodsearch = 'category';
        search.placeholder = 'Search By Category';
    }
    search.focus();
    search.value = '';
    showData();
}
function searchData(value){
    let table = '';
    value = value.toLowerCase();

    for(let i = 0; i < dataPro.length; i++){
        if(moodsearch === 'title' && dataPro[i].title.includes(value)){
            table += `
            <tr>
                <td>${i+1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td><button onclick="updateProduct(${i})">Update</button></td>
                <td><button onclick="deleteProduct(${i})">Delete</button></td>
            </tr>`;
        } else if(moodsearch === 'category' && dataPro[i].category.includes(value)){
            table += `
            <tr>
                <td>${i+1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td><button onclick="updateProduct(${i})">Update</button></td>
                <td><button onclick="deleteProduct(${i})">Delete</button></td>
            </tr>`;
        }
    }

    document.getElementById('table-body').innerHTML = table;
}
 
//light dark mode
let toggleBtn = document.getElementById('toggleMode');

toggleBtn.onclick = function() {
    document.body.classList.toggle('light'); // يبدل المود
    if(document.body.classList.contains('light')){
        toggleBtn.textContent = '☀️';
        localStorage.setItem('mode', 'light');
    } else {
        toggleBtn.textContent = '🌙';
        localStorage.setItem('mode', 'dark');
    }
}

// استرجاع المود عند تحميل الصفحة
window.onload = function() {
    let mode = localStorage.getItem('mode');
    if(mode === 'light'){
        document.body.classList.add('light');
        toggleBtn.textContent = '☀️';
    } else {
        toggleBtn.textContent = '🌙';
    }
}
//sort
let ascending = true; // لازم يكون معرف قبل الاستخدام

function sortData(key) {
    dataPro.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // لو الرقم فعلاً رقم، حوله Number
        if(!isNaN(valA) && !isNaN(valB)){
            valA = Number(valA);
            valB = Number(valB);
            return ascending ? valA - valB : valB - valA;
        } else {
            // trim المسافات + lowercase + ignore punctuation
            valA = valA.toString().trim().toLowerCase();
            valB = valB.toString().trim().toLowerCase();
            return ascending 
                ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' }) 
                : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
        }
    });

    ascending = !ascending; // اقلب الترتيب عند كل مرة
    showData(); // عرض البيانات بعد الترتيب
}
