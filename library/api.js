console.log("API loaded");
window.api = {
    dictionaries: {
        trates: {
            description: "Interest rates for different terms in months.",
            values: {"1":0.0546,"2":0.0546,"3":0.0546,"4":0.0545,"5":0.0543,"6":0.0542,"7":0.0538,"8":0.0534,"9":0.0531,"10":0.0527,"11":0.0523,"12":0.0519,"13":0.0517,"14":0.0515,"15":0.0512,"16":0.051,"17":0.0508,"18":0.0506,"19":0.0503,"20":0.0501,"21":0.0499,"22":0.0497,"23":0.0494,"24":0.0492,"25":0.0491,"26":0.0489,"27":0.0488,"28":0.0486,"29":0.0485,"30":0.0483,"31":0.0482,"32":0.048,"33":0.0479,"34":0.0477,"35":0.0476,"36":0.0474,"37":0.0473,"38":0.0473,"39":0.0472,"40":0.0471,"41":0.047,"42":0.047,"43":0.0469,"44":0.0468,"45":0.0468,"46":0.0467,"47":0.0466,"48":0.0466,"49":0.0465,"50":0.0464,"51":0.0463,"52":0.0463,"53":0.0462,"54":0.0461,"55":0.0461,"56":0.046,"57":0.0459,"58":0.0458,"59":0.0458,"60":0.0457,"61":0.0457,"62":0.0457,"63":0.0457,"64":0.0457,"65":0.0457,"66":0.0457,"67":0.0457,"68":0.0457,"69":0.0457,"70":0.0457,"71":0.0457,"72":0.0457,"73":0.0457,"74":0.0457,"75":0.0457,"76":0.0457,"77":0.0457,"78":0.0457,"79":0.0457,"80":0.0457,"81":0.0457,"82":0.0457,"83":0.0457,"84":0.0457,"85":0.0457,"86":0.0457,"87":0.0457,"88":0.0457,"89":0.0457,"90":0.0457,"91":0.0457,"92":0.0457,"93":0.0457,"94":0.0456,"95":0.0456,"96":0.0456,"97":0.0456,"98":0.0456,"99":0.0456,"100":0.0456,"101":0.0456,"102":0.0456,"103":0.0456,"104":0.0456,"105":0.0456,"106":0.0456,"107":0.0456,"108":0.0456,"109":0.0456,"110":0.0456,"111":0.0456,"112":0.0455,"113":0.0455,"114":0.0455,"115":0.0455,"116":0.0455,"117":0.0455,"118":0.0455,"119":0.0455,"120":0.0455,"121":0.0455,"122":0.0455,"123":0.0456,"124":0.0456,"125":0.0456,"126":0.0456,"127":0.0456,"128":0.0456,"129":0.0457,"130":0.0457,"131":0.0457,"132":0.0457,"133":0.0457,"134":0.0457,"135":0.0458,"136":0.0458,"137":0.0458,"138":0.0458,"139":0.0458,"140":0.0459,"141":0.0459,"142":0.0459,"143":0.0459,"144":0.0459,"145":0.0459,"146":0.046,"147":0.046,"148":0.046,"149":0.046,"150":0.046,"151":0.046,"152":0.0461,"153":0.0461,"154":0.0461,"155":0.0461,"156":0.0461,"157":0.0461,"158":0.0462,"159":0.0462,"160":0.0462,"161":0.0462,"162":0.0462,"163":0.0463,"164":0.0463,"165":0.0463,"166":0.0463,"167":0.0463,"168":0.0463,"169":0.0464,"170":0.0464,"171":0.0464,"172":0.0464,"173":0.0464,"174":0.0464,"175":0.0465,"176":0.0465,"177":0.0465,"178":0.0465,"179":0.0465,"180":0.0466,"181":0.0466,"182":0.0466,"183":0.0466,"184":0.0466,"185":0.0466,"186":0.0467,"187":0.0467,"188":0.0467,"189":0.0467,"190":0.0467,"191":0.0467,"192":0.0468,"193":0.0468,"194":0.0468,"195":0.0468,"196":0.0468,"197":0.0468,"198":0.0469,"199":0.0469,"200":0.0469,"201":0.0469,"202":0.0469,"203":0.047,"204":0.047,"205":0.047,"206":0.047,"207":0.047,"208":0.047,"209":0.0471,"210":0.0471,"211":0.0471,"212":0.0471,"213":0.0471,"214":0.0471,"215":0.0472,"216":0.0472,"217":0.0472,"218":0.0472,"219":0.0472,"220":0.0473,"221":0.0473,"222":0.0473,"223":0.0473,"224":0.0473,"225":0.0473,"226":0.0474,"227":0.0474,"228":0.0474,"229":0.0474,"230":0.0474,"231":0.0474,"232":0.0475,"233":0.0475,"234":0.0475,"235":0.0475,"236":0.0475,"237":0.0475,"238":0.0476,"239":0.0476,"240":0.0476,"241":0.0476,"242":0.0476,"243":0.0476,"244":0.0476,"245":0.0476,"246":0.0476,"247":0.0476,"248":0.0476,"249":0.0475,"250":0.0475,"251":0.0475,"252":0.0475,"253":0.0475,"254":0.0475,"255":0.0475,"256":0.0475,"257":0.0475,"258":0.0475,"259":0.0475,"260":0.0475,"261":0.0475,"262":0.0475,"263":0.0475,"264":0.0475,"265":0.0475,"266":0.0474,"267":0.0474,"268":0.0474,"269":0.0474,"270":0.0474,"271":0.0474,"272":0.0474,"273":0.0474,"274":0.0474,"275":0.0474,"276":0.0474,"277":0.0474,"278":0.0474,"279":0.0474,"280":0.0474,"281":0.0474,"282":0.0474,"283":0.0473,"284":0.0473,"285":0.0473,"286":0.0473,"287":0.0473,"288":0.0473,"289":0.0473,"290":0.0473,"291":0.0473,"292":0.0473,"293":0.0473,"294":0.0473,"295":0.0473,"296":0.0473,"297":0.0473,"298":0.0473,"299":0.0473,"300":0.0473,"301":0.0472,"302":0.0472,"303":0.0472,"304":0.0472,"305":0.0472,"306":0.0472,"307":0.0472,"308":0.0472,"309":0.0472,"310":0.0472,"311":0.0472,"312":0.0472,"313":0.0472,"314":0.0472,"315":0.0472,"316":0.0472,"317":0.0472,"318":0.0471,"319":0.0471,"320":0.0471,"321":0.0471,"322":0.0471,"323":0.0471,"324":0.0471,"325":0.0471,"326":0.0471,"327":0.0471,"328":0.0471,"329":0.0471,"330":0.0471,"331":0.0471,"332":0.0471,"333":0.0471,"334":0.0471,"335":0.047,"336":0.047,"337":0.047,"338":0.047,"339":0.047,"340":0.047,"341":0.047,"342":0.047,"343":0.047,"344":0.047,"345":0.047,"346":0.047,"347":0.047,"348":0.047,"349":0.047,"350":0.047,"351":0.047,"352":0.0469,"353":0.0469,"354":0.0469,"355":0.0469,"356":0.0469,"357":0.0469,"358":0.0469,"359":0.0469,"360":0.0469}
        }
    }
};
