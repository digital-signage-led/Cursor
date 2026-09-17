/** 全国会場テンプレート（都道府県庁所在地＋主要都市）
 * point: 環境省WBGT（6桁・末尾0付き。APIは5桁へ変換）
 * area: 気象庁 市町村等コード（7桁）
 * 追加会場はこの配列に追記するだけでOK
 */
window.WBGT_SITES = [
  {id:'sapporo',pref:'北海道',site:'北海道札幌市',point:'141630',area:'0110000',wbgt:'札幌',rain:'札幌市'},
  {id:'aomori',pref:'青森県',site:'青森県青森市',point:'313120',area:'0220100',wbgt:'青森',rain:'青森市'},
  {id:'morioka',pref:'岩手県',site:'岩手県盛岡市',point:'334310',area:'0320100',wbgt:'盛岡',rain:'盛岡市'},
  {id:'sendai',pref:'宮城県',site:'宮城県仙台市',point:'343920',area:'0410000',wbgt:'仙台',rain:'仙台市'},
  {id:'akita',pref:'秋田県',site:'秋田県秋田市',point:'324020',area:'0520100',wbgt:'秋田',rain:'秋田市'},
  {id:'yamagata',pref:'山形県',site:'山形県山形市',point:'354260',area:'0620100',wbgt:'山形',rain:'山形市'},
  {id:'fukushima',pref:'福島県',site:'福島県福島市',point:'361270',area:'0720100',wbgt:'福島',rain:'福島市'},
  {id:'mito',pref:'茨城県',site:'茨城県水戸市',point:'402010',area:'0820100',wbgt:'水戸',rain:'水戸市'},
  {id:'utsunomiya',pref:'栃木県',site:'栃木県宇都宮市',point:'412770',area:'0920100',wbgt:'宇都宮',rain:'宇都宮市'},
  {id:'maebashi',pref:'群馬県',site:'群馬県前橋市',point:'422510',area:'1020100',wbgt:'前橋',rain:'前橋市'},
  {id:'saitama',pref:'埼玉県',site:'埼玉県さいたま市',point:'432410',area:'1110000',wbgt:'さいたま',rain:'さいたま市'},
  {id:'chiba',pref:'千葉県',site:'千葉県千葉市',point:'452120',area:'1210000',wbgt:'千葉',rain:'千葉市'},
  {id:'tokyo',pref:'東京都',site:'東京都',point:'441320',area:'1310100',wbgt:'東京',rain:'東京都'},
  {id:'yokohama',pref:'神奈川県',site:'神奈川県横浜市',point:'461060',area:'1410000',wbgt:'横浜',rain:'横浜市'},
  {id:'niigata',pref:'新潟県',site:'新潟県新潟市',point:'542320',area:'1510000',wbgt:'新潟',rain:'新潟市'},
  {id:'toyama',pref:'富山県',site:'富山県富山市',point:'551020',area:'1620100',wbgt:'富山',rain:'富山市'},
  {id:'kanazawa',pref:'石川県',site:'石川県金沢市',point:'562270',area:'1720100',wbgt:'金沢',rain:'金沢市'},
  {id:'fukui',pref:'福井県',site:'福井県福井市',point:'570660',area:'1820100',wbgt:'福井',rain:'福井市'},
  {id:'kofu',pref:'山梨県',site:'山梨県甲府市',point:'491420',area:'1920100',wbgt:'甲府',rain:'甲府市'},
  {id:'nagano',pref:'長野県',site:'長野県長野市',point:'481560',area:'2020100',wbgt:'長野',rain:'長野市'},
  {id:'gifu',pref:'岐阜県',site:'岐阜県岐阜市',point:'525860',area:'2120100',wbgt:'岐阜',rain:'岐阜市'},
  {id:'shizuoka',pref:'静岡県',site:'静岡県静岡市',point:'503310',area:'2210000',wbgt:'静岡',rain:'静岡市'},
  {id:'nagoya',pref:'愛知県',site:'愛知県名古屋市',point:'511060',area:'2310000',wbgt:'名古屋',rain:'名古屋市'},
  {id:'tsu',pref:'三重県',site:'三重県津市',point:'531330',area:'2420100',wbgt:'津',rain:'津市'},
  {id:'otsu',pref:'滋賀県',site:'滋賀県大津市',point:'602160',area:'2520100',wbgt:'大津',rain:'大津市'},
  {id:'kyoto',pref:'京都府',site:'京都府京都市',point:'612860',area:'2610000',wbgt:'京都',rain:'京都市'},
  {id:'osaka',pref:'大阪府',site:'大阪府大阪市',point:'620780',area:'2710000',wbgt:'大阪',rain:'大阪市'},
  {id:'kobe',pref:'兵庫県',site:'兵庫県神戸市',point:'635180',area:'2810000',wbgt:'神戸',rain:'神戸市'},
  {id:'nara',pref:'奈良県',site:'奈良県奈良市',point:'640360',area:'2920100',wbgt:'奈良',rain:'奈良市'},
  {id:'wakayama',pref:'和歌山県',site:'和歌山県和歌山市',point:'650420',area:'3020100',wbgt:'和歌山',rain:'和歌山市'},
  {id:'tottori',pref:'鳥取県',site:'鳥取県鳥取市',point:'691220',area:'3120100',wbgt:'鳥取',rain:'鳥取市'},
  {id:'matsue',pref:'島根県',site:'島根県松江市',point:'681320',area:'3220100',wbgt:'松江',rain:'松江市'},
  {id:'okayama',pref:'岡山県',site:'岡山県岡山市',point:'664080',area:'3310000',wbgt:'岡山',rain:'岡山市'},
  {id:'hiroshima',pref:'広島県',site:'広島県広島市',point:'674370',area:'3410000',wbgt:'広島',rain:'広島市'},
  {id:'yamaguchi',pref:'山口県',site:'山口県山口市',point:'812860',area:'3520100',wbgt:'山口',rain:'山口市'},
  {id:'tokushima',pref:'徳島県',site:'徳島県徳島市',point:'711060',area:'3620100',wbgt:'徳島',rain:'徳島市'},
  {id:'takamatsu',pref:'香川県',site:'香川県高松市',point:'720860',area:'3720100',wbgt:'高松',rain:'高松市'},
  {id:'matsuyama',pref:'愛媛県',site:'愛媛県松山市',point:'731660',area:'3820100',wbgt:'松山',rain:'松山市'},
  {id:'kochi',pref:'高知県',site:'高知県高知市',point:'741820',area:'3920100',wbgt:'高知',rain:'高知市'},
  {id:'fukuoka',pref:'福岡県',site:'福岡県福岡市',point:'821820',area:'4010000',wbgt:'福岡',rain:'福岡市'},
  {id:'saga',pref:'佐賀県',site:'佐賀県佐賀市',point:'851420',area:'4120100',wbgt:'佐賀',rain:'佐賀市'},
  {id:'nagasaki',pref:'長崎県',site:'長崎県長崎市',point:'844960',area:'4220100',wbgt:'長崎',rain:'長崎市'},
  {id:'kumamoto',pref:'熊本県',site:'熊本県熊本市',point:'861410',area:'4310000',wbgt:'熊本',rain:'熊本市'},
  {id:'oita',pref:'大分県',site:'大分県大分市',point:'832160',area:'4420100',wbgt:'大分',rain:'大分市'},
  {id:'miyazaki',pref:'宮崎県',site:'宮崎県宮崎市',point:'873760',area:'4520100',wbgt:'宮崎',rain:'宮崎市'},
  {id:'kagoshima',pref:'鹿児島県',site:'鹿児島県鹿児島市',point:'883170',area:'4620100',wbgt:'鹿児島',rain:'鹿児島市'},
  {id:'naha',pref:'沖縄県',site:'沖縄県那覇市',point:'911970',area:'4720100',wbgt:'那覇',rain:'那覇市'}
];

window.WBGT_SITE_BY_ID = Object.fromEntries(
  window.WBGT_SITES.map(s => [s.id, s])
);

window.applyWbgtSiteFields = function(s){
  if(!s) return null;
  return {
    site_id: s.id,
    site: s.site,
    point: s.point,
    area: s.area,
    wbgt_place: '環境省（観測地点：' + s.wbgt + '）',
    rain_place: '気象庁（' + s.rain + '）'
  };
};
