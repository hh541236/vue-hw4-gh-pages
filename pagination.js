export default{
    // 傳入分頁資訊(從外到內)
    props: ['pages'],
    // Bootstrap 分頁樣板
    template:`<nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{ disabled: !pages.has_pre}">
                <a class="page-link" href="#" aria-label="Previous"
                @click="$emit('get-product', pages.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li class="page-item" 
                :class="{ active: page === pages.current_page }"
                v-for="page in pages.total_pages" :key="page + 'page'">
                <a class="page-link" href="#"
                @click="$emit('get-product', page)">{{page}}</a>
            </li>

            <li class="page-item" :class="{ disabled: !pages.has_next}">
                <a class="page-link" href="#" aria-label="Next"
                @click="$emit('get-product', pages.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
    `
    //  :7 (前一頁功能) 加入一個 class，!pages.has_pre(如果沒有前一頁)，就 "disabled (無法按)"
    //  :9  @click="$emit('get-product', pages.current_page - 1)" 當前值 - 1 (上一頁)
    //  :21(下一頁功能) 加入一個 class，!pages.has_next(如果沒有下一頁)，就 "disabled (無法按)"
    //  :23 @click="$emit('get-product', pages.current_page - 1)" 當前值 + 1 (下一頁)
    //  :15 加入一個 class="active" 顯示當前是哪頁，page === pages.current_page(判斷變數的 page 是否跟當前頁一樣)
    //  :16 使用 v-for，page in pages.total_pages 當後面為數值時 v-for 會從 1 開始代
    //  :16 :key 為了避免有重複值可在後面加字串
    //  :9,18,23 emit 方法(自定義名稱屬性[盡量用"-"命名], 變數)


}