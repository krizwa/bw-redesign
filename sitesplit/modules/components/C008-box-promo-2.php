<!-- PHP Conditions: for developer only [begin] --> 
<?php 
	if(isset($data) && $data!='') {
		$styleClassName = $data;
	}
?> 
<!-- PHP Conditions: for developer only [end] --> 
<!-- 
 HTML notes for developer: options for the use of classes: 

 * for different background style: 
 - - .promo-bg-color-1
 - - .promo-bg-color-2 
 - - .promo-bg-color-3
 - - .... 
--> 


<div class="promo <?php echo $styleClassName ?>" tabindex="0">
	
		<!-- Image -->
		<div class="copy-wrapper">
			<!-- HEADER -->
			<h3>Private Banking services</h3>
			<!-- SNIPPET -->
			<div class="snippet">
				<p>Our success in wealth management is built on the personal relationship between each client and their private banker</p>
			</div>
			
			<!-- CTA -->
			<div class="cta-wrapper">        
				<a href="" class="cta">Find out more</a>
			</div>
		</div>

		<figure><img src="etc/designs/bwpublic/img/temp-content/hub-bu-1.jpg" alt=''></figure>

	
	<!-- ADD TO DOCK CONTROL -->
	<a href="#" title="Click here to add item to dock  Private Banking services" class="add-to-dock" data-dock-id="2Fcontent2Fbwpublic2Fen_gb2Fhome2Fwealth-management2Fwhat-we-offer2Fprivate-banking-services" data-dock-type='' data-dock-title='Private Banking services' data-dock-copy='Our success in wealth management is built on the personal relationship between each client and their private banker' data-dock-url="/en_gb/home/wealth-management/what-we-offer/private-banking-services.html">Add to my collection</a>
	<!-- <a data-dock-url="/en_gb/home/wealth-management/what-we-offer/philanthropy.html" data-dock-copy="Manage your philanthropy with the help of our dedicated service" data-dock-title="Philanthropy" data-dock-type="" data-dock-id="2Fcontent2Fbwpublic2Fen_gb2Fhome2Fwealth-management2Fwhat-we-offer2Fphilanthropy" class="add-to-dock add-to-dock-added" title="Click here to add item to dock  Philanthropy" href="#">Remove from my collection</a> -->

</div>
