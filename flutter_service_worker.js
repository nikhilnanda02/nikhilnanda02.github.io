'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "6083a6005f660ac40dcf2fbf6880fdff",
"index.html": "862bd957b2d025ab9a8743924b4c402f",
"/": "862bd957b2d025ab9a8743924b4c402f",
"main.dart.js": "1dc6951b9bc7e4bde2a75f0c05b8f1e8",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "e3be5e48ebf84c8f34c23f3d2e7f4892",
"assets/AssetManifest.json": "ec2cfcfc11745daeef575ba5d5811be0",
"assets/certificates/newgen_ssl_cert.pem": "be956a50676cf3682ba980695ed0867a",
"assets/NOTICES": "8149b81da5bbb189dce0d53308e0baab",
"assets/FontManifest.json": "5a97e645340e18d9778d1062cb4fd3cd",
"assets/AssetManifest.bin.json": "08790378b75b04fa755f480f0050e898",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "39d3f055f88a6cfe721a2fb5e27d685f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "8e2c26d1ebd58b60e538f1ede759b8b1",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "17ee8e30dde24e349e70ffcdc0073fb0",
"assets/packages/flutter_inappwebview_web/assets/web/web_support.js": "ffd063c5ddbbe185f778e7e41fdceb31",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/getwidget/icons/slack.png": "19155b848beeb39c1ffcf743608e2fde",
"assets/packages/getwidget/icons/twitter.png": "caee56343a870ebd76a090642d838139",
"assets/packages/getwidget/icons/linkedin.png": "822742104a63a720313f6a14d3134f61",
"assets/packages/getwidget/icons/dribble.png": "1e36936e4411f32b0e28fd8335495647",
"assets/packages/getwidget/icons/youtube.png": "1bfda73ab724ad40eb8601f1e7dbc1b9",
"assets/packages/getwidget/icons/line.png": "da8d1b531d8189396d68dfcd8cb37a79",
"assets/packages/getwidget/icons/pinterest.png": "d52ccb1e2a8277e4c37b27b234c9f931",
"assets/packages/getwidget/icons/whatsapp.png": "30632e569686a4b84cc68169fb9ce2e1",
"assets/packages/getwidget/icons/google.png": "596c5544c21e9d6cb02b0768f60f589a",
"assets/packages/getwidget/icons/wechat.png": "ba10e8b2421bde565e50dfabc202feb7",
"assets/packages/getwidget/icons/facebook.png": "293dc099a89c74ae34a028b1ecd2c1f0",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "3b348c3c0ab6e0a3da59bc51fb859e73",
"assets/fonts/MaterialIcons-Regular.otf": "0366bc5d0a67b8c2cb4ddc7f9893d356",
"assets/assets/vendors/opall/JSAnnotationFactory.js": "87bbfa87efca16029ccee1a29b655035",
"assets/assets/vendors/opall/vendors/pdf.js": "a4372620a17aa5487a972138c931a0a6",
"assets/assets/vendors/opall/vendors/l10n.js": "63bde39f580306c507248fd8a45508d6",
"assets/assets/vendors/opall/vendors/compatibility.js": "8519d6c5cc85f04226d99ec50d13cc90",
"assets/assets/vendors/opall/vendors/pdf.worker.js": "d534dd5173ccfcce685a65e8fa3e0385",
"assets/assets/vendors/opall/vendors/debugger.js": "95cb09b51c05a97b1bc901a1050af264",
"assets/assets/vendors/opall/JSannotation.js": "9136f5690a2dabdb1e3ef4313f883d41",
"assets/assets/vendors/opall/css/bootstrap.css": "2eceeb342334eb8cc251a13945629aba",
"assets/assets/vendors/opall/css/style.css": "1cf2031bed9048eb6d5bcf35ecdaeac4",
"assets/assets/vendors/opall/viewer.js": "b4a4a797e4354f819d3c193f7e31eff7",
"assets/assets/vendors/opall/OpAllWrapper.js": "51126d5634d82b837ba4ba7d9cfbcf40",
"assets/assets/vendors/opall/document.js": "c211b551f5c42653ab5d09b732d0c3a7",
"assets/assets/images/info_icon.svg": "7d9461569d6a99f6f35e804871821cb6",
"assets/assets/images/search.svg": "fc960a9aab4c9dec51c085fcd8f63e9f",
"assets/assets/images/linkedWI_blue.svg": "6942f52b795f456253d8964d023caaea",
"assets/assets/images/completed_milestone.svg": "616450f663d232940eb502da97590493",
"assets/assets/images/rtf.svg": "cbdf64d1b80b44f410b10e6e4a1ee5a8",
"assets/assets/images/loading_indicator_done.gif": "ecd54e8e62d70eebfb1f821e0d6d4d7f",
"assets/assets/images/crop_grey.svg": "45cce4e292e6548388813613bfd47012",
"assets/assets/images/fingerprint_small.svg": "f16b95c4e88431f1b7cd3f09241bc129",
"assets/assets/images/initiate_blue_icon.svg": "33ce282b14eb567f2ff6057188d27fa3",
"assets/assets/images/release_icon.svg": "e833b0208de09a46669e6ac6f523e551",
"assets/assets/images/modify.svg": "53f00bd74824d22400b73f57e565ef42",
"assets/assets/images/txt.svg": "954fc3c8fee38469cf4203d5cebab714",
"assets/assets/images/iBPSLogo1.svg": "97df76a7bb949153a603b5659d11c817",
"assets/assets/images/face.svg": "e662f536a6ca893f6c3f7d62b7a5b01a",
"assets/assets/images/iBPS_No_Case_present.svg": "14abded32f42288251d7ee25688e5a33",
"assets/assets/images/history_grey.svg": "d33191374ed938d064354db416690efa",
"assets/assets/images/selection_check3.svg": "9275c102c5c2e8d317d3c954897d3ca3",
"assets/assets/images/cases_icon.svg": "b2d550bcb82d50a0ebbfdf8163235074",
"assets/assets/images/docx.svg": "f35920e7d42fd57640a96e8c2d0fdd09",
"assets/assets/images/selection_check2.svg": "40e46031c62ac49b06e7616fc0b4f3cd",
"assets/assets/images/iBPS_Message_sent_successfully.svg": "9e4ff23af8b9b52a8b1d307c53052858",
"assets/assets/images/reminder_icon.svg": "c5073bc65d340f430a9932c7149e2d14",
"assets/assets/images/ibps_exceptions_blue.svg": "3236b1439520a594fcb4f454b4fa8e58",
"assets/assets/images/no_workitem.svg": "081f700d07f1010de6bff1fb16fec497",
"assets/assets/images/iBPS_Password_changed_successfully.svg": "5c21194bfde9f667aa9424e845ae7580",
"assets/assets/images/newgen.svg": "13fb4e2939a91b143928c6fdee86ba4b",
"assets/assets/images/sorting.svg": "2d716bca67b6b709be008ffd940dcca8",
"assets/assets/images/add_icon.svg": "09a0e58e16d3ffcb4537b87e75b0866b",
"assets/assets/images/workitem_icon.svg": "b02626faddba38d62925bf0b234448ab",
"assets/assets/images/edges_blue.svg": "b214fb16df030604e4d1bece0771a279",
"assets/assets/images/settings_icon.svg": "63db80f363b35a07632077f36463907e",
"assets/assets/images/share_icon.svg": "723a0698a092194de88aa2aedfee571a",
"assets/assets/images/info_icon_12x12.svg": "2de09e5d462220fd7b84b6b1be57e830",
"assets/assets/images/summary_filled_icon.svg": "fea4a3948c8391781b363d7cec548bc5",
"assets/assets/images/thumb_small.svg": "5bf444e23fb87ca5e9139f686a7b781c",
"assets/assets/images/xlxs.svg": "9d3693d81239358fb5d19671e5ee5851",
"assets/assets/images/help_icon.svg": "67777775e303cc444cfe79d0425490d0",
"assets/assets/images/refresh_icon.svg": "ec27bee317b7964d4f223b9ed808772a",
"assets/assets/images/reassign_grey.svg": "528c3df3a675b3a27616a5ec65294ffe",
"assets/assets/images/revoke_icon.svg": "78b045594c3ee7535f75fdc35b9be200",
"assets/assets/images/home_icon.svg": "bfb2bf21388388c53719fdae93cf0b85",
"assets/assets/images/bookmark_icon.svg": "9ac1678c4f660963200dfa3622425949",
"assets/assets/images/file.svg": "2414d0d6469c4ab1f88798fa359f11fe",
"assets/assets/images/no_doc_folder.svg": "7130a930db45d45f2cc96da4fd740dc6",
"assets/assets/images/properties.svg": "1e72b959c057b05dedaa4eb06d04d20b",
"assets/assets/images/delete_icon.svg": "ba50bbe08691e352d0d7ae6daaab752d",
"assets/assets/images/browser_filled_icon.svg": "2194ae3d69cc81f80038cde8c1e4bdcd",
"assets/assets/images/iBPS_Failure.svg": "6f1f74cd8496c64bdf8078d4340b7883",
"assets/assets/images/dashboard_icon.svg": "38a513bd566189dc276fc96c3f8ddf17",
"assets/assets/images/powered_by_newgen.svg": "11cda4e2e8910b12de7364e0b2b609de",
"assets/assets/images/recents_icon.svg": "f6680d1a107301d9b308de6dd4b607f5",
"assets/assets/images/more_filled_icon.svg": "a5cba381daed90f04762fe47a275bcd3",
"assets/assets/images/todo_orange.svg": "26923059d9d033de1a263af98b41618d",
"assets/assets/images/edit_icon.svg": "89864b5d4ebf5f8eec2b58d2b31be10b",
"assets/assets/images/mark_as_unread.svg": "c7b5c384baa07e6fb749a92ff332d1fb",
"assets/assets/images/tasks_icon.svg": "cfd8af6855708faeae2c59ab8a61079f",
"assets/assets/images/form_blue.svg": "a1956be02c489c7ae61d75fcbeb2d152",
"assets/assets/images/not_uploaded_icon.svg": "210696c8e7f3b98bb0c91d50a19bb7e4",
"assets/assets/images/rotate_blue.svg": "32e3a022cf89d69ae3573e1f1690a5ff",
"assets/assets/images/hold_blue_42.svg": "43cea2b3b97e052d3a3647231bd8bea6",
"assets/assets/images/conversation_blue.svg": "35d3493f625797198594e700e50b4642",
"assets/assets/images/document_grey.svg": "819ee43062f5268a745b8aa45f2298a6",
"assets/assets/images/forward_arrow.svg": "0eaef907f8078f7916fbfd78f086c4eb",
"assets/assets/images/iBPS_No_Document_Present.svg": "2a2264866d8198d22e921f2813bce30b",
"assets/assets/images/low_priority_icon.svg": "e65a850f00b481473e288a5d33bea745",
"assets/assets/images/mark_as_read.svg": "5444ea36cbfab3469ab780d0017aece8",
"assets/assets/images/todo_grey.svg": "dc5edd0e39b4a5a4267a94019d7e9234",
"assets/assets/images/iBPS_Success.svg": "ff91e6e71c34a25eae1ffd784f4cb6de",
"assets/assets/images/retake_blue.svg": "4483db12f94d5d699328d63bb0cbe194",
"assets/assets/images/user_large_icon.svg": "86096fc1721cfbc0c8705f09230c3bcc",
"assets/assets/images/Initiative_icon.svg": "41cacdd1e573f79586fdd831e409f7da",
"assets/assets/images/setAsLatest.svg": "f42f51486b671af8b576066f84251f0d",
"assets/assets/images/more_icon_blue.svg": "896a6d2ba522273864153ac523d623b3",
"assets/assets/images/info_filled_icon.svg": "1741222ca73b351b6cf55b0295e63228",
"assets/assets/images/eye_close.svg": "594aca60a3f4de060f4f040177d6c131",
"assets/assets/images/progress_blue.svg": "b7d9d6f1c5169441792bda47af018742",
"assets/assets/images/iBPS_No_comment.svg": "39974e2beb6b9ef5cb998b44ddfacc5d",
"assets/assets/images/download.svg": "3641ce20c6d48a0c8c86fc4b9e5a1489",
"assets/assets/images/gallery.svg": "26bbec33ed11e559265e1c97537728b5",
"assets/assets/images/no_todo.svg": "d5d1bbbc07cc057fd42f2dbb8dfd47d9",
"assets/assets/images/back_android.svg": "ee5db411d84dd5e41e7b5c3171c27fdf",
"assets/assets/images/iBPS_No_internet.svg": "84f4d6430e25b4e11e0f57adc4baadbf",
"assets/assets/images/default_doc.svg": "b6a75972e8c653fb78fb38371e4dcd60",
"assets/assets/images/ibpslogo2.png": "e3019e795d258d93fdaf5ba779e2b507",
"assets/assets/images/comments_blue.svg": "0d7abb16cc9e744d7ec913cda84bf720",
"assets/assets/images/ibps_exception_grey.svg": "d2371db8110efab7340cdca7edb88b9c",
"assets/assets/images/progress_orange.svg": "c5d4a8368bc2afdab3d5bc1af4fb08e4",
"assets/assets/images/gif.svg": "ce650a9706f1fb05d735e6caac6938a9",
"assets/assets/images/no_data_icon.svg": "3a3a4d42c4e7e2750e80ebb03f3a2233",
"assets/assets/images/add_blue.svg": "67d638be399f87b8f4f3ad8e12fb9694",
"assets/assets/images/add_workitem.svg": "5a39270daf337db329926dcb4ff8305f",
"assets/assets/images/info_icon_orange.svg": "8a3acaaf54d43b3670b23f5e6af61786",
"assets/assets/images/form_filled_icon.svg": "0970c2080aada97ae48b4b6c956cca85",
"assets/assets/images/iBPS_No_Tasks.svg": "90f58186dd55e1b5d235e04aef4ca6c4",
"assets/assets/images/info_icon_grey.svg": "67aa5ebc77a6a54c90816f37b6ed63cd",
"assets/assets/images/more_icon.svg": "7209c3894a0a5001e9a4b76d19314df7",
"assets/assets/images/set_priority.svg": "4bbd877812b94ac7868ec002e9edafbf",
"assets/assets/images/check.svg": "f5c0b577190690059fdcb2de609d5528",
"assets/assets/images/fingerprint_small.png": "b2ee62a80464726fd5dfe3574b725714",
"assets/assets/images/iBPS_No_history.svg": "3a1bc8e773a89e1be99acafa370c2f20",
"assets/assets/images/download_icon.svg": "2e985f3c5ec197411ac2b8bbae82a500",
"assets/assets/images/medium_priority_icon.svg": "27487c723c603fb9a322edbbaf98dee2",
"assets/assets/images/iBPS_No_Variable.svg": "df609b1afbfb65a87661f9ac1ed7368e",
"assets/assets/images/ibps_De-link.svg": "b3d335ea5d86c2e52cf7caed3e3bea81",
"assets/assets/images/filter_grey.svg": "18041a82987d01cbd7184b3fb257f945",
"assets/assets/images/hold_blue_52.svg": "f80d88ba244495bcc0f0549b98616040",
"assets/assets/images/iBPS_No_Rules_Defined.svg": "a61259a72ea5b06332f04c1b921816b0",
"assets/assets/images/pin_icon.svg": "c514c2b0b8f7a341c1d91f1970c35773",
"assets/assets/images/info_icon_16x16.svg": "3ed1d13caec055d428a0dfaf974d8473",
"assets/assets/images/home_filled.svg": "7522d220433dc6aff65ea650a79b4379",
"assets/assets/images/jpeg.svg": "74bce9e6a21af86bfd86671afc7af979",
"assets/assets/images/add_grey.svg": "d7e389babfb81dc989eeefef2066c686",
"assets/assets/images/thumb.svg": "78a67a8ef108d6cca36474ca5eed09c2",
"assets/assets/images/sample_tiff.tiff": "df87217e2c181ae6674898dff27e5a56",
"assets/assets/images/iBPS_No_workitem_linked.svg": "de67b28e103c401c5bf9fc961641da15",
"assets/assets/images/refresh.svg": "0641c2ca28934cdde356512a11bbdba9",
"assets/assets/images/finger_print_image.png": "d7a21d0e32425034c7a254cacb64480f",
"assets/assets/images/comments_grey.svg": "a14e2a96672fbea7db11e62bad664864",
"assets/assets/images/sample_xls.xls": "d732eef37d941722c8b23221bf173161",
"assets/assets/images/save.svg": "66e27f68ed7ee55012e41932adc7d95b",
"assets/assets/images/splash.png": "a35ec79474fb876cb3869bc4afa716c6",
"assets/assets/images/filter_blue.svg": "164a331d1502139f2061627998b2a150",
"assets/assets/images/waiting_milestone.svg": "4c34b1f0b9dfbec9c812e05b7823f63b",
"assets/assets/images/delete_big.svg": "be32b42472c0dff7812118b99c30541d",
"assets/assets/images/no_exception.svg": "5f380fc14ac82cf4c95189d30664b427",
"assets/assets/images/back.svg": "d9a87df32b891d3fcf52b0444d8eeead",
"assets/assets/images/task_filled_icon.svg": "0d33128c8679f67add13b687adfd3ba9",
"assets/assets/images/notification.svg": "2728c324cbdcddbc8ca41386d435dda7",
"assets/assets/images/workitem_exception_icon.svg": "26e956b123fdb97c2d4a44107cdc3ce0",
"assets/assets/images/initiate.svg": "4f00330100cd05eeba0339125cc42034",
"assets/assets/images/iBPSLogo1Old.svg": "9235441ae8fbe5a4d6c14abb22cb0b41",
"assets/assets/images/reassign_icon.svg": "f8a32513cc8180a2287ed10fba2d4321",
"assets/assets/images/info_icon_blue.svg": "411f9b31c0b16e37c8464d813ca30b87",
"assets/assets/images/eye_open.svg": "31a1894820ee34013bdc4a1151202e94",
"assets/assets/images/send.svg": "2e768d1857199adbb0b3f58354ba0309",
"assets/assets/images/iBPS_No_Search_result.svg": "2e5c21d20d02218db632d27d667a256a",
"assets/assets/images/merge_icon.svg": "7be31e0e19c452b5cbfac9c73db0e3e8",
"assets/assets/images/camera.svg": "2ecbbd1b1de0214efe7662ba1199696b",
"assets/assets/images/calendar_filled_icon.svg": "8fd2e111195bf1d0ea0a77895ba0be1d",
"assets/assets/images/todo_blue.svg": "5f1468de0dba42ea63a057f1b9ed964f",
"assets/assets/images/sample-jpg.jpg": "56fdbe69d346f2228bb90aa059c95dc2",
"assets/assets/images/more_icon_grey.svg": "caebd1adc446927f0e2dbc15efd5a117",
"assets/assets/images/delete_small.svg": "c01356704f0552d369a52743e10adbea",
"assets/assets/images/retake_grey.svg": "7633d6c032f8758ee9ac7d0cc4e1a94b",
"assets/assets/images/no_exception_add.svg": "c354f04c2708150da654e4aeae2d1cc6",
"assets/assets/images/sample.pdf": "4b41a3475132bd861b30a878e30aa56a",
"assets/assets/images/rotate_grey.svg": "d85f1d384472025dda3fa8b2b6005667",
"assets/assets/images/document_filled_icon.svg": "11a604ff47a4c3c447f176825caee92a",
"assets/assets/images/summary.svg": "287c38c58dfc1c82ae797ef30efca628",
"assets/assets/images/form_grey.svg": "ef23985472ca8a56c9dd0a44c888dbad",
"assets/assets/images/faceauthlogo.svg": "8ac601ea070a76eb9d10c20e1ea29c89",
"assets/assets/images/document_blue.svg": "3ad459fccc1da48a081042d3a958314f",
"assets/assets/images/conversation_grey.svg": "12f8ed400707e98e041cd9183ad10a37",
"assets/assets/images/face_small.svg": "20808549942ddfaa7b1953f4dcf4e2e4",
"assets/assets/images/odt.svg": "0073dcb7fe2443430ca0450c8bc2d460",
"assets/assets/images/queue_menu_icon.svg": "ec5fdd52dbbef430a3cbc89ed169fac5",
"assets/assets/images/thumbnail.png": "ea9f62c61d60cfeb4ed58bc7131b5412",
"assets/assets/images/recents_filled.svg": "c9fa8a72a4153c03e47319ecd691fed1",
"assets/assets/images/pdf.svg": "f1312864abdcb94979313ed8db45fc7e",
"assets/assets/images/history_orange.svg": "53bcf994cbac127c3be87829b21e225c",
"assets/assets/images/ppt.svg": "c8cbd7fbe0f0a81708d0fd49e3866a33",
"assets/assets/images/history_icon.svg": "1d45fa76e35e2e227840484dee6369d3",
"assets/assets/images/declined_milestone.svg": "7285ad223508ef9f7d2a06a7c9ca36f9",
"assets/assets/images/exceptions_filled_icon.svg": "6b5e6f96308f61bf8f889fb00b562c66",
"assets/assets/images/progress_grey.svg": "906bcdbd974bda63eea00a05b89d9405",
"assets/assets/images/calendar_icon.svg": "139fdc75344eec3755b9d7e007b7b76d",
"assets/assets/images/iBPS_No_conversation.svg": "d1f72addc02823e2393362c2260fe933",
"assets/assets/images/workitem.svg": "17cf2e20b9a5e75868f88caae6b62cce",
"assets/assets/images/initiated_milestone.svg": "74583b1a5a018f0335e0bac32f3b2fa3",
"assets/assets/images/clock.svg": "b0e4db5329d1a3a57b862be1a4fde328",
"assets/assets/images/document_orange.svg": "50223f4a931eaa7440280401b0b59d32",
"assets/assets/images/back_ios.svg": "38a957163df47d69fe88436860f35b6d",
"assets/assets/images/linkedWI_Orange.svg": "56d2cc1550ef4b9e4684f341c74f6dcb",
"assets/assets/images/summary_blue.svg": "4947dce8f6a744fa206ebb482409a438",
"assets/assets/images/edges_grey.svg": "2e2375e0e2e2a91a8775b681fd72b39e",
"assets/assets/images/something_went_wrong.svg": "70f89dda23933c228cc4eac6359ca8a5",
"assets/assets/images/selection_check.svg": "1110ae5949f77a9ea1c908692cee0052",
"assets/assets/images/workitem_lock_icon.svg": "5db4cc86a72910d097c69d4a52b78297",
"assets/assets/images/feedback_icon.svg": "9afceb360a3a16c376c46493a700de96",
"assets/assets/images/dropdown.svg": "899673be8a70410cad8226fe3abb9d23",
"assets/assets/images/conversation_orange.svg": "c5efc6db93f5bfb460084ddfe1758ee1",
"assets/assets/images/share.svg": "d997638fc433ea879e38471101cf745b",
"assets/assets/images/faceauthlogo.png": "a3f22d65d813be5e1d29e39b762a79a5",
"assets/assets/images/filter.svg": "bf647656f536a558c9075ceee1827d2e",
"assets/assets/images/high_priority_icon.svg": "a9ad7f910c011ef12f068ea6a1f991ce",
"assets/assets/images/reassign_blue.svg": "0b6b68ee7ba9bf9ca5badf9aa421c255",
"assets/assets/images/browser_icon.svg": "34a2f710fbf7537ffe662c06d1cd93ab",
"assets/assets/images/done_icon.svg": "09f8b4647511ddbd62a1587b86514023",
"assets/assets/images/assign_to_me.svg": "4483122f3d12a35e7883d41d5c76ba73",
"assets/assets/images/email_info.svg": "aa6421d7c0892bd21cd1e0c7ee6e089e",
"assets/assets/images/loading_indicator.gif": "081808402c011c4c44061084a153fd64",
"assets/assets/images/hold_grey.svg": "e135111259ed7612cdff05cf9b7d8532",
"assets/assets/images/very_low_priority_icon.svg": "33be770a8389b6b5adde74e3ba17dd95",
"assets/assets/images/logout_icon.svg": "93845531273a91b9f598d2451fd3ab14",
"assets/assets/images/next_activity.svg": "3914e706882515c760339dddfd3daafb",
"assets/assets/images/crop_blue.svg": "29e43658dfbd78789e4f1eb9feb461b2",
"assets/assets/images/conversion_orange.svg": "c5efc6db93f5bfb460084ddfe1758ee1",
"assets/assets/images/iBPS_No_work_item_found.svg": "081f700d07f1010de6bff1fb16fec497",
"assets/assets/images/linkedWI_grey.svg": "298a60f6dca692f9db9faf9f8168af03",
"assets/assets/images/ibpslogo.png": "40fad395bb6c50fa59caf90807062f06",
"assets/assets/images/xls.svg": "7967a8a0dc3964b2c51218fee58ec61b",
"assets/assets/images/merge.svg": "2f8548af0ad8810457a4426e1c42212b",
"assets/assets/images/finger_print_image.svg": "e1ce5c909d3ae9c68b74f976d52dac05",
"assets/assets/images/png.svg": "8e74a64b050974485d9e69bf95f5333c",
"assets/assets/images/user_small_icon.svg": "3ff8c7f8f9593f5daf39393a457f944e",
"assets/assets/images/refer_icon.svg": "95cd0d320def289c8d87d104169cde9c",
"assets/assets/images/reminder_list_icon.svg": "4fb0c80e06cdf5d5a8803187ebe2f672",
"assets/assets/images/comments_orange.svg": "b108fe70ae744d459de59cfad890ed56",
"assets/assets/images/dashboard_filled.svg": "4ad3d374a24c7d9c25c3caef2e94ab2d",
"assets/assets/images/history_blue.svg": "c983f61bb98bc2e6e663abf7426c9a98",
"assets/assets/html/document.html": "3956b9465b604d9ee519b93fcb6f81b3",
"assets/assets/lang/en.json": "ba53278ad76ec4b4f3c1abd61ccef7e6",
"assets/assets/lang/ar.json": "24f7048273ffa5d3914a964d3882b79f",
"assets/assets/fonts/OpenSans-SemiBold.ttf": "ba5cde21eeea0d57ab7efefc99596cce",
"assets/assets/fonts/OpenSans-Bold.ttf": "1025a6e0fb0fa86f17f57cc82a6b9756",
"assets/assets/fonts/OpenSans-Regular.ttf": "3ed9575dcc488c3e3a5bd66620bdf5a4",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
