// 引入 Vue
import{ createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
// 引入區域元件
import pagination from './pagination.js'
// bootstrap 用 (新增、刪除)
let productModal = '';
let delProductModal = '';

// 這是外層
const app = createApp({
    // 區域註冊元件
    components:{
      pagination
    },
    data(){
        return{
          url: 'https://vue3-course-api.hexschool.io/v2',
          path:'fengchiliu',
          // 建立一個空陣列來存商品的資料
          products:[],
          // 用來確認是否為新增或編輯
          isNew:false,
          // 建立一個空物件來暫存被選中商品的資料
          tempProduct: {
            imgUrl:[]
          },
          // 建立一個空的物件來存取回傳的分頁資訊
          pagination:{},
        }
    },
    methods:{
      // 確認是否登入成功
      check(){
        // 取出 token 
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        axios.post(`${this.url}/api/user/check`)
          .then((res) =>{
            // 登入成功後驗證是否為後台使用者
            this.getData();
          })
          .catch((err) =>{
            window.location = 'login.html';
          })
      },
      // 如果為後台者，即可讀取後台資料
      getData(page = 1){  // 參數預設值 (進頁面是第 1 頁) -> 有 query 參數(用"?"做使用)、param 參數 ...
        axios.get(`${this.url}/api/${this.path}/admin/products/?page=${page}`) // 更改 Api路徑，products中才有分頁資訊，page代法: '?page=${page}'
          .then(res=>{
            this.products = res.data.products;
            // 取出 pagination
            this.pagination = res.data.pagination;
          })
          .catch(err=>{
            alert(err.data.message);
          })
      },
      openProduct(item){
        // 將點擊的資訊加入暫存的物件中
        this.tempProduct = item;
      },
      // 判斷是新增、編輯或刪除的方式開啟 Modal
      openModal(action, item){
        // 新增
        if(action==='new'){
          this.tempProduct = {
            imgUrl: []
          }
          // 切換狀態
          this.isNew = true;
          productModal.show();
        }
        // 編輯
        else if(action==='edit'){
          // 複製產品資料到暫存的 tempProduct (淺拷貝)
          this.tempProduct = { ...item }
          // 切換狀態
          this.isNew = false;
          productModal.show();
        }
        // 刪除
        else if(action==='delete'){
          // 複製產品資料到暫存的 tempProduct (淺拷貝)
          this.tempProduct = { ...item }
          delProductModal.show()
        }
      },
    },
  
    // 一開始先做的事項
    mounted(){
      // 透過 JS 方式開啟 Modal
      // 抓取 productModal 的部分(實體化)
      productModal = new bootstrap.Modal(document.getElementById('productModal'));
      // 抓取 delProductModal 的部分(實體化)
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'))
      // 先做確認動作，確認是否為登入狀態
      this.check();
    }
});

// 全域註冊元件(在app後，mount前，一次是註冊一個、是一個方法)
app.component('productModal', {   // productModal 為自定義名稱，做為HTML標籤使用 -> 須改為 " product-modal"
  props:['tempProduct','isNew'],  // 須接受外層的資料來使用
  template:'#templateForProductModal',  // 抓取 x-template 的樣板
  data(){   // api 資訊也要帶過來
      return{
        url: 'https://vue3-course-api.hexschool.io/v2',
        path: 'fengchiliu',
        productModal: '',
      }; 
  },
  methods:{
    updateProduct(){    // 內層需要的方法，所以搬到內層用
      let url = `${this.url}/api/${this.path}/admin/product`;
      let http = 'post';
      // 判斷是編輯資料
      if(!this.isNew){
        url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`
        http = 'put'
      }
      // 此時 http值:
      // 新增為 axios.post
      // 編輯為 axios.put     
      // 要發送 data 中 tempProduct 的資料，前後需加"{}" api 格式需要
      axios[http](url, { data: this.tempProduct })
        .then((res)=>{
          // 回傳成功訊息
          alert(res.data.message);
          productModal.hide();
          // this.getData();  // 這邊沒有 getData 的方法 (改用 emit 觸發外層事件)
          this.$emit('get-data');
        })
        .catch((err)=>{
          // 回傳錯誤訊息
          console.dir(err);
          alert(err.data.message)
        })
    },
    createImages() {
      // 新增空白陣列
      this.tempProduct.imgUrl = [];
      this.tempProduct.imgUrl.push('');
    },
  }
})

app.component('delProductModal',{
  props: ['tempProduct','isNew'],
  template: '#templateForDelModal',
  data(){
    return{
      url: 'https://vue3-course-api.hexschool.io/v2',
        path: 'fengchiliu',
    }
  },
  methods:{
    deleteProduct(){
      let url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`
      axios.delete(url)
        .then((res)=>{
          // 回傳成功訊息
          alert(res.data.message);
          delProductModal.hide();
          // this.getData(); // 這邊沒有 getData 的方法 (改用 emit 觸發外層事件)
          this.$emit('get-data');
        })
        .catch((err)=>{
          // 回傳錯誤訊息
          console.dir(err);
          alert(err.data.message)
        })
    },
  }
})

app.mount('#app');
