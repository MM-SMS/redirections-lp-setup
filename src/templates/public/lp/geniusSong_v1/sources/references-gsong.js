function references() {
	const domain = "geniussongofficial.com";
	const prodName = "Genius Song";
	const mainProduct = "The " + prodName;
	const US1ProdName = "Youthful Brain";
	const US1Product = "Youthful Brain";
	const supportEmail = "support@geniussongofficial.com";
	const expert = "Dr. Robert Lake";
	const expertEmail = supportEmail;
	const expertEmailLink = "mailto:" + expertEmail;
	
	if (document.title=="Product Name") document.title=mainProduct;
	
	var list = document.getElementsByClassName("refGroupName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = mainProduct; }
	list = document.getElementsByClassName("refUS1");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = US1Product; }
	list = document.getElementsByClassName("refSupport");
	for (var i=0; i<list.length; i++) { list[i].href = "mailto:" + supportEmail; }
	list = document.getElementsByClassName("refDomain");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = domain; }
	
	var list = document.getElementsByClassName("theProdName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = mainProduct; }
	list = document.getElementsByClassName("prodName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = prodName; }
	list = document.getElementsByClassName("US1ProdName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = US1ProdName; }
	list = document.getElementsByClassName("theUS1ProdName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = US1Product; }
	
	list = document.getElementsByClassName("expert");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = expert; }
	list = document.getElementsByClassName("expertEmail");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = expertEmail; }
	
	list = document.getElementsByClassName("expertEmailLink");
	for (var i=0; i<list.length; i++) { list[i].href = expertEmailLink; }
	
	const refLeft =`
	<ul class="ref-list">
			<li><div class="refnum">1.</div> Venkatraman, R.. You're 96 Percent Less Creative 
			Than You Were as a Child. Here's How to Reverse That. Inc.com.<br> 
			<u>https://www.inc.com/rohini-venkatraman/4-ways-to-get-back-creativity-you-had-as-a-kid.html</u></li>
			
			<li><div class="refnum">2.</div> Kerley, J. Creative Inventive Design and Research. 
			<u>https://ntrs.nasa.gov/api/citations/19940029213/downloads/19940029213.pdf</u></li>
			
			<li><div class="refnum">3.</div>
			Robinson, K. “Do Schools Kill Creativity?”. 
			<u>https://www.youtube.com/watch?v=iG9CE55wbtY</u></li> 
		 	
			<li><div class="refnum">4.</div> Uable, 28 August 2023. “The end of education.” 
			<u>https://medium.com/@connect_75384/the-end-of-education-94f3a39fe97c</u></li> 
			
			<li><div class="refnum">5.</div> Church, D., Yang, A., Fannin, J., & Blickheuser, K. (2022). 
			The biological dimensions of transcendent states: A randomized controlled trial. Frontiers in Psychology, 13, 928123. 
			<u>https://doi.org/10.3389/fpsyg.2022.928123</u></li>
			
			<li><div class="refnum">6.</div> Herrmann, C. S., Strüber, D., Helfrich, R. F., & Engel, 
			A. K. (2016). EEG oscillations: From correlation to causality. International Journal of Psychophysiology, 103, 12-21.
			<u>https://doi.org/10.1016/j.ijpsycho.2015.02.003</u></li> 
			
			<li><div class="refnum">7.</div> Poe, G. R. (2017). Sleep Is for Forgetting. Journal of Neuroscience, 37(3), 464-473.
			<u>https://doi.org/10.1523/JNEUROSCI.0820-16.2017</u></li>
			
			<li><div class="refnum">8.</div> Crivelli-Decker, J., Hsieh, L.-T., Clarke, A., & Ranganath, 
			C. (Year). Theta oscillations promote temporal sequence learning. Neurobiology of Learning and Memory, 
			Volume Number(Page Numbers). <u>https://doi.org/10.1016/j.nlm.2018.05.001</u></li> 
				
		 	
				
	</ul>
	`;
	
	const refRight =`
	<ul class="ref-list">                    
	
			<li><div class="refnum">9.</div> Zielinski, M. C., Tang, W., & Jadhav, S. P. (2020). 
			The role of replay and theta sequences in mediating hippocampal-prefrontal interactions 
			for memory and cognition. Hippocampus, 30(1), 60-72. <u>https://doi.org/10.1002/hipo.22821</u></li>  
		 	
			<li><div class="refnum">10.</div> Henao, D., Navarrete, M., Valderrama, M., & Le Van Quyen, M. (2020). 
			Entrainment and synchronization of brain oscillations to auditory stimulations. 
			Neuroscience Research, 156, 271-278. <u>https://doi.org/10.1016/j.neures.2020.03.004</u></li>
				
			<li><div class="refnum">11.</div> Hanslmayr, S., Axmacher, N., & Inman, C. S. (2019). 
			Modulating human memory via entrainment of brain oscillations. Trends in Neurosciences, 
			42(7), 485-499. <u>https://doi.org/10.1016/j.tins.2019.04.004</u></li>  
		 	
			<li><div class="refnum">12.</div> Michael, E., Santamaria Covarrubias, L., Leong, V., & Kourtzi, 
			Z. (2023). Learning at your brain's rhythm: individualized entrainment boosts learning for 
			perceptual decisions. Cerebral Cortex, 33(9), 5382-5394. <u>https://doi.org/10.1093/cercor/bhac426</u></li> 
				
			<li><div class="refnum">13.</div> Trost, W., Frühholz, S., Schön, D., Labbé, C., Pichon, S., 
			Grandjean, D., & Vuilleumier, P. (2014). Getting the beat: entrainment of brain activity by musical 
			rhythm and pleasantness. NeuroImage, 103, 55-64. <u>https://doi.org/10.1016/j.neuroimage.2014.09.009</u></li>  
			
			<li><div class="refnum">14.</div> Trost, W. J., Labbé, C., & Grandjean, D. (2017). 
			Rhythmic entrainment as a musical affect induction mechanism. Neuropsychologia, 96, 
			96-110. <u>https://doi.org/10.1016/j.neuropsychologia.2017.01.004</u></li>  
	</ul>
	`;
	
	list = document.getElementsByClassName("ref-lft");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = refLeft };
	list = document.getElementsByClassName("vsls2lft");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = refLeft };
	
	list = document.getElementsByClassName("ref-rgt");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = refRight };
	list = document.getElementsByClassName("vsls2rgt");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = refRight };
	
	const testis = `
<div class="s18tbx">
		<img src="images/start-quote.png" alt="" class="start-quote">
			
			<img src="images/t1.png" alt="" class="s18timg">
			
		<p class="bdfont3 bold"><i>“I feel like a new woman! I’m learning French!”</i></p>  
			
			<p class="bdfont mar1"><i>“Before I started using this product, I felt I was at the mercy 
			of events. Bad things would happen, and I had no control. 
			Over time, I’d accepted this as my fate. Even when something 
			good would happen like when my daughter got engaged, 
			it was a sinking feeling because I felt like the universe would balance out the good and send me something bad. </i></p>
			
			<p class="bdfont mar1"><i>Over the years, I’d tried meditation, yoga and even the Law of Attraction stuff 
			but nothing seemed to truly impact my&nbsp;life.</i></p>
			
			<p class="bdfont mar1"><i>Within 2 weeks of listening to the Genius Wave, this product has made me a new woman. I’m much kinder 
			to my kids and husband, and I’m learning to speak French. It's actually easy now! It’s hard to describe. 
			My life feels enchanted now, like I'm the center of some wonderful little fairy tale.</i></p> 
			
			<p class="bdfont mar1"><i>While I would never be able to afford to fly to Dr. Rivers and see him in person, I can’t thank him and his 
			colleagues enough for making this available to people who need it. Five&nbsp;stars.”</i></p>
			
			<p class="bdfont mar1"><strong>-Rachel,</strong> Nurse in&nbsp;Tustin, CA</p>
			<img src="images/end-quote.png" alt="" class="end-quote">
	</div>
	
	<div class="s18tbx">
		<img src="images/start-quote.png" alt="" class="start-quote">
			
			<img src="images/t2.png" alt="" class="s18timg">
			
		<p class="bdfont3 bold">“My wife says my IQ has gone up 20 points, <br class="hide-tab">was able to leave my 9-5..”</p>
			
			<p class="bdfont mar1"><i>“I wanted to try this for the financial aspect. I’d hoped 
			tapping into Theta would unlock that genius “creative ability” 
			we all had as young kids and help me grow my Amazon business. 
			I also hoped my 6 year old and 8 year old would take an interest in 
			bettering their mind too when they saw me do it. </i></p>
			
			<p class="bdfont mar1"><i>I didn’t notice much the first week. But in week two, my wife commented that I’d seemed sharper. 
			She joked you were always smart but it seems like your IQ has gone up 20 points. It’s been a 
			couple months now and my Amazon business is doing well enough that I quit my 9-5. When problems arise, 
			I don’t get worried now. I just know Theta will figure it out for me. And within a couple days, 
			the solution just comes to me. I told my friends it’s my new superpower!</i></p>
			
			<p class="bdfont mar1"><i>My kids love listening to this product before bed. The best benefit of all might be that they don’t 
			fight us on bedtime anymore! I hope this helps someone who wants to improve their finances like 
			I did. I love this product.”</i> </p>
			
			<p class="bdfont mar1"><strong>-Michael,</strong> Business&nbsp;Owner, Dallas, TX</p>
		<img src="images/end-quote.png" alt="" class="end-quote">
	</div> 
	
	<div class="s18tbx">
		<img src="images/start-quote.png" alt="" class="start-quote">
			
			<img src="images/t3.png" alt="" class="s18timg">
			
		<p class="bdfont3 bold">“The curse is over! I got promoted..”</p>
			
			<p class="bdfont mar1"><i>“Since I was a kid, my family has been superstitious. Everyone 
			says we have bad luck. A few years ago, my mom was sick and 
			the doctor told my mom she needed to have her leg amputated 
			to save her life. So she had the surgery. And then we found after 
			she didn’t need to have her leg amputated. Things like that. So I was excited when Dr.&nbsp;Rivers 
			talked about what happens when we’re at the Theta level more often. And this soundwave has changed everything for&nbsp;me.</i></p> 
			
			<p class="bdfont mar1"><i>My relationship with my husband has transformed. And in a team meeting, an idea struck me out of nowhere 
			that’s grown our entire company. A little after that, I got promoted. My family’s so-called curse is no more. 
			I&nbsp;can’t believe how different I feel now. I feel like everyone should know about this product. 
			I&nbsp;have recommended it to all my friends and family.”</i></p>
			
			<p class="bdfont mar1"><strong>-Hannah,</strong> Graphic&nbsp;Designer, Manhattan, NY</p>
		<img src="images/end-quote.png" alt="" class="end-quote">
	</div>	
	`;
	
	list = document.getElementsByClassName("testiquotes");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = testis };
}
references();
