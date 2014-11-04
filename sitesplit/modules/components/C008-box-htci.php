<!-- PHP Conditions: for developer only [begin] --> 
<?php 
	if(isset($data) && $data!='') {

		$styleClassName = "";
		
		switch ($data) {
			case "style-primary":
			  	$styleClassName = "style-primary";
			  break; 
			case "style-secondary":
			  	$styleClassName = "style-secondary";
			  break; 
			case "style-tertiary":
			  	$styleClassName = "style-tertiary";
			  break; 
		}
	}
?> 
<!-- 
 HTML notes for developer: options for the use of classes: 

 * for box style (has to be used with '.box' class): 
 - - .style-primary
 - - .style-secondary
 - - .style-tertiary
 
--> 

<!-- PHP Conditions: for developer only [end] --> 


<article class="box <?php echo $styleClassName ?>">
	<a href="#" title="Click here to add item to dock  Private Banking services" class="add-to-dock" data-dock-id="2Fcontent2Fbwpublic2Fen_gb2Fhome2Fwealth-management2Fwhat-we-offer2Fprivate-banking-services" data-dock-type='' data-dock-title='Private Banking services' data-dock-copy='Our success in wealth management is built on the personal relationship between each client and their private banker' data-dock-url="/en_gb/home/wealth-management/what-we-offer/private-banking-services.html">Add to my collection</a>
    
	
	<div class="content">
		<h2>Wealth Management</h2>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
		<div class="cta-wrapper">
         	<a href="#" class="cta">Find out more</a>
         </div>      
	</div>

	<figure class="media">
		<img alt="" src="etc/designs/bwpublic/img/temp-content/hub-bu-1.jpg">
	</figure>
</article>


