import * as jQuery from '../../Framework/jquery.min.js'
import * as ram from '../../UtilAsFramework/ram.js'
import * as prom from '../../UtilAsFramework/promise.js'
import * as aJax from '../../DataAPI/ajax.js'
import * as utils from '../../UtilAsFramework/utils.js'
//Rx
import {
    forkJoin,
    Observable,
    from, of, fromEvent,
    combineLatest
} from 'https://dev.jspm.io/rxjs@6/_esm2015';
import * as operators from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';
import { ajax } from 'https://dev.jspm.io/rxjs@6/_esm2015/ajax';

let rootPage = 'https://davuflower.github.io/';
let getProductAjax = aJax.ajaxCall(rootPage + 'data/data_sanpham.json');
let getGiftAjax = aJax.ajaxCall(rootPage + 'data/data_quatangkem.json');

let url = new URL(window.location.href);
let idSanPham = url.searchParams.get("id")

let ajax$ = forkJoin(
    from(getProductAjax),
    from(getGiftAjax)
    )
    .pipe(
        operators.map(
            ([productJsons, giftJsons]) =>
                productJsons.concat(giftJsons)),
        //operators.map(jsons => jsons.filter(
        //    json => json.id == idSanPham
        //))
    )

ajax$.subscribe(jsons => console.log(jsons))






let url$ = of(idSanPham)
    .pipe(
        operators.map(id => {
            if (id.includes("#"))
                return id;
            throw new Error("NoParameter")
        }),
        
    )

url$.subscribe(
    console.log,
    err => console.log(err)
)


let itemRaw$ = combineLatest(ajax$, url$)
.pipe(
    operators.map(([jsons, idSP]) => {
        return jsons.filter(
            json => json.id == idSP
        )
    }),
    operators.pluck(0),
)

itemRaw$.subscribe(
    console.log,
    err => console.log(err)
)

let itemDetail$ = itemRaw$.pipe(
    operators.map(loadRamItemDetailRx)
).subscribe(console.log)

let itemImg$ = itemRaw$.pipe(
    operators.map(item => {


        loadRamItemImgRx(item)
    })
).subscribe(console.log)

    


function loadRamItemDetailRx(item) {
    let itemInRam = {}
    itemInRam.description = item.description
    itemInRam.price = item.price
    itemInRam.title = item.title

    return itemInRam;


}

function loadRamItemImgRx(item) {
    let rootPage = 'https://davuflower.github.io/data'
    return forkJoin(
        from(ram.loadImgAsync(rootPage + item.imgLinkLarge1)),
        from(ram.loadImgAsync(rootPage + item.imgLinkLarge2)),
        from(ram.loadImgAsync(rootPage + item.imgLinkSmall1)),
        from(ram.loadImgAsync(rootPage + item.imgLinkSmall2))
    ).pipe(
        operators.map(
            ([imgLinkLarge1,
                imgLinkLarge2,
                imgLinkSmall1,
                imgLinkSmall2]) =>
            {
                let imgLinkLarge = [imgLinkLarge1, imgLinkLarge2]
                let imgLinkSmall = [imgLinkSmall1, imgLinkSmall2]

                let itemInRam = {
                    "imgLinkLarge": imgLinkLarge,
                    "imgLinkSmall": imgLinkSmall
                }

                return itemInRam
                
            }
        )
    )
}

//console.log(url$)