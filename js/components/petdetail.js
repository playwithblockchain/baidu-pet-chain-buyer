$(function() {
	var petDetailHtml = '\
		<div class="modal fade" id="petDetail" role="dialog" aria-labelledby="buyModalCenterTitle" aria-hidden="true">\
		  <div class="modal-dialog modal-dialog-centered" role="document">\
			<div class="modal-content">\
			  <div class="modal-header">\
				<h5 class="modal-title" id="buyModalLongTitle">狗狗详情</h5>\
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
				  <span aria-hidden="true">&times;</span>\
				</button>\
			  </div>\
			  <div class="modal-body">\
				<div style="width:100%; background-color:#FFFDE7">\
					<img src="https://blockchain-pet-online.cdn.bcebos.com/PET_SVG_4af3fabe3561f225782f22934356a735" style="width: 29.314rem; height: 7.9855rem;"/>\
				</div>\
				<div style="width:100%; ">\
					<label>所有者：</label><label>王尼马</label>\
				</div>\
				<div>\
					<label><h4>属性</h4></label>\
				</div>\
				<div>\
					<ul class="ulList">\
						<li class="liList">体型：皮卡<font style="margin: 10px; color: #F76707;">稀有</font></li>\
						<li class="liList">花纹：霸气点<font style="display: none;"></font></li>\
						<li class="liList">眼睛：小杀气<font style="margin: 10px; color: #F76707;">稀有</font></li>\
						<li class="liList">眼睛色：土黄<font style="display: none;"></font></li>\
						<li class="liList">嘴巴：三瓣<font style="display: none;"></font></li>\
						<li class="liList">肚皮色：白色<font style="display: none;"></font></li>\
						<li class="liList">身体色：浅褐<font style="display: none;"></font></li>\
						<li class="liList">花纹色：变异橙<font style="margin: 10px; color: #F76707;">稀有</font></li>\
					</ul>\
				</div>\
			  </div>\
			</div>\
		  </div>\
		</div>\
	';

	var petDetailHtmlCss = '\
		<style>\
			.ulList {\
				list-style:none;overflow:hidden;\
			}\
			.liList {\
				float:left;\
				width : 50%;\
			}\
		</style>\
		';
	
	$("head").append(petDetailHtmlCss);
	$("body").append(petDetailHtml);
});