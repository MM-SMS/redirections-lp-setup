function references() {
	const domain = "BrainSongOfficial.com";
	const prodName = "Brain Song";
	const mainProduct = "The " + prodName;
	const US1Suffix = "Double Strength Edition";
	const US1ProdName = prodName + " " + US1Suffix;
	const US1Product = mainProduct + " " + US1Suffix;
	const supportEmail = "support@" + domain;
	const expert = "Dr. Rivers";
	const expertEmail = "DrRivers@" + domain;
	const expertEmailLink = "mailto:" + expertEmail;
	
	if (document.title=="Product Name") document.title=mainProduct;
	
	var list = document.getElementsByClassName("refGroupName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = mainProduct; }
	list = document.getElementsByClassName("refUS1");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = US1Product; }
	list = document.getElementsByClassName("refSupport");
	for (var i=0; i<list.length; i++) {
		if (!!list[i].href) {
		  list[i].href = "mailto:" + supportEmail;
		}
		if (!!list[i].innerHTML && list[i].innerHTML.indexOf("@") >0) {
			list[i].innerHTML = supportEmail;
		}
	}
	list = document.getElementsByClassName("refDomain");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = domain; }
	
	var list = document.getElementsByClassName("theProdName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = mainProduct; }
	list = document.getElementsByClassName("prodName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = prodName; }
	list = document.getElementsByClassName("US1ProdName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = US1ProdName; }
	list = document.getElementsByClassName("US1Suffix");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = US1Suffix; }

	list = document.getElementsByClassName("theUS1ProdName");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = US1Product; }
	
	list = document.getElementsByClassName("expert");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = expert; }
	list = document.getElementsByClassName("expertEmail");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = expertEmail; }
	
	list = document.getElementsByClassName("expertEmailLink");
	for (var i=0; i<list.length; i++) { list[i].href = expertEmailLink; }
		
	const refLeft =	`
		<ul class="ref-list">
			<li><div class="refnum">1.</div> Sun, F. W., Stepanovic, M. R., Andreano, J., Barrett, L. F., Touroutoglou, 
			A., & Dickerson, B. C. (2016). Youthful Brains in Older Adults: Preserved Neuroanatomy in the Default 
			Mode and Salience Networks Contributes to Youthful Memory in Superaging. <i>The Journal of neuroscience: 
			the official journal of the Society for Neuroscience, 36</i>(37), 9659–9668.  
			<u>https://doi.org/10.1523/JNEUROSCI.1492-16.2016</u></li>
			
			<li><div class="refnum">2.</div> Bathina, S., & Das, U. N. (2015). Brain-derived 
			neurotrophic factor and its clinical implications. <i>Archives of medical science : 
			AMS, 11</i>(6), 1164–1178. <u>https://doi.org/10.5114/aoms.2015.56342</u>  </li>
			
			<li><div class="refnum">3.</div> Miranda, M., Morici, J. F., Zanoni, M. B., & Bekinschtein, P. 
			(2019). Brain-Derived Neurotrophic Factor: A Key Molecule for Memory in the Healthy and the 
			Pathological Brain. <i>Frontiers in cellular neuroscience, 13,</i> 363. <u>https://doi.org/10.3389/fncel.2019.00363</u></li> 
			 
			<li><div class="refnum">4.</div> Yang, T., Nie, Z., Shu, H., Kuang, Y., Chen, X., Cheng, J., ... & Liu, 
			H. (2020). The role of BDNF on neural plasticity in depression. <i>Frontiers in cellular neuroscience, 14,</i> 82.</li> 
			
			<li><div class="refnum">5.</div> Zhang, X., Feng, D., Barry, D., & Li, J. (2024). Closed-loop control of 
			gamma oscillations in the brain connections through the transcranial stimulations. <i>arXiv preprint arXiv:2403.06794</i></li>
			
			<li><div class="refnum">6.</div> Collins, E. M. (2018). <i>Super Ager: You Can Look Younger, Have More Energy, 
			a Better Memory, and Live a Long and Healthy Life.</i> Mango Media Inc.</li> 
			
			<li><div class="refnum">7.</div> Bekinschtein, P., Cammarota, M., Katche, C., Slipczuk, L., Rossato, 
			J. I., Goldin, A., Izquierdo, I., & Medina, J. H. (2008). BDNF is essential to promote persistence of 
			long-term memory storage. <i>Proceedings of the National Academy of Sciences of the United States of America, 
			105(7)</i>, 2711–2716. <u>https://doi.org/10.1073/pnas.0711863105</u></li>
			
			<li><div class="refnum">8.</div> Suppa, A., & Cheeran, B. (2014). Further insights into the effect of 
			BDNF genotype on non-invasive brain stimulation. <i>Clinical Neurophysiology: Official Journal of the 
			International Federation of Clinical Neurophysiology, 126(7)</i>, 1281-1283.</li> 
			
			<li><div class="refnum">9.</div> Schmidt, M. A., & Goodwin, T. J. (2014, January). Protecting Neural Structures 
			and Cognitive Function During Prolonged Space Flight by Targeting the Brain Derived Neurotrophic 
			Factor Molecular Network. In <i>2015 NASA Human Research Program Investigators''Workshop (HRP IWS 2015)</i> 
			(No. JSC-CN-32241).</li> 
			
			<li><div class="refnum">10.</div> Solan, M. (2022, September 1). The mental powers of super-agers. 
			Harvard Health. <u>https://www.health.harvard.edu/mind-and-mood/the-mental-powers-of-super-agers</u> </li> 
			
			<li><div class="refnum">11.</div> <i>Super-agers: This Special Group of older adults suggests you can 
			keep your brain young and spry</i>. Harvard Health. (2017, July 5). 
			<u>https://www.health.harvard.edu/blog/super-agers-this-special-group-of-older-adults-suggests-you-can-keep-your-brain-young-and-spry-2017070511957</u> </li>
			
			<li><div class="refnum">12.</div> Sun, F. W., Stepanovic, M. R., Andreano, J., Barrett, L. F., 
			Touroutoglou, A., & Dickerson, B. C. (2016). Youthful Brains in Older Adults: Preserved Neuroanatomy 
			in the Default Mode and Salience Networks Contributes to Youthful Memory in Superaging. 
			<i>The Journal of neuroscience: the official journal of the Society for Neuroscience, 36(37)</i>, 
			9659–9668. <u>https://doi.org/10.1523/JNEUROSCI.1492-16.2016</u></li>
			
			<li><div class="refnum">13.</div> Sanchez-Roman, I., Ferrando, B., Holst, C. M., Mengel-From, 
			J., Rasmussen, S. H., Thinggaard, M., Bohr, V. A., Christensen, K., & Stevnsner, T. (2022). 
			Molecular markers of DNA repair and brain metabolism correlate with cognition in centenarians. 
			<i>GeroScience, 44</i>(1), 103–125. <u>https://doi.org/10.1007/s11357-021-00502-2</u></li> 
			 
			<li><div class="refnum">14.</div> Sanchez-Roman, I., Ferrando, B., Holst, C. M., Mengel-From, J., 
			Rasmussen, S. H., Thinggaard, M., Bohr, V. A., Christensen, K., & Stevnsner, T. (2022). Molecular 
			markers of DNA repair and brain metabolism correlate with cognition in centenarians. <i>GeroScience, 
			44</i>(1), 103–125. <u>https://doi.org/10.1007/s11357-021-00502-2</u></li> 
			
			<li><div class="refnum">15.</div> Bathina, S., & Das, U. N. (2015). Brain-derived neurotrophic factor 
			and its clinical implications. <i>Archives of medical science : AMS, 11</i>(6), 1164–1178. 
			<u>https://doi.org/10.5114/aoms.2015.56342</u></li>
			
			<li><div class="refnum">16.</div> Binder, D. K., & Scharfman, H. E. (2004). Brain-derived neurotrophic factor. 
			<i>Growth factors (Chur, Switzerland), 22</i>(3), 123–131. <u>https://doi.org/10.1080/08977190410001723308</u></li> 
			
			<li><div class="refnum">17.</div> Bathina, S., & Das, U. N. (2015). Brain-derived neurotrophic factor 
			and its clinical implications. <i>Archives of medical science : AMS, 11</i>(6), 1164–1178. <u>https://doi.org/10.5114/aoms.2015.56342</u></li>
			
			<li><div class="refnum">18.</div> <i>BDNF: How meditation may prevent a*******'s & d******a</i>. EOC Institute. 
			(n.d.). <u>https://eocinstitute.org/meditation/bdnf-how-meditation-prevents-a*******'s-disease-d******a/</u> </li> 
			
			<li><div class="refnum">19.</div> Bekinschtein, P., Cammarota, M., Katche, C., Slipczuk, L., Rossato, J. I., 
			Goldin, A., Izquierdo, I., & Medina, J. H. (2008). BDNF is essential to promote persistence of long-term 
			memory storage. <i>Proceedings of the National Academy of Sciences of the United States of America, 
			105</i>(7), 2711–2716. <u>https://doi.org/10.1073/pnas.0711863105</u></li> 
			
			<li><div class="refnum">20.</div> Bekinschtein, P., Cammarota, M., Katche, C., Slipczuk, L., Rossato, 
			J. I., Goldin, A., Izquierdo, I., & Medina, J. H. (2008). BDNF is essential to promote persistence of 
			long-term memory storage. <i>Proceedings of the National Academy of Sciences of the United States of America, 
			105</i>(7), 2711–2716. <u>https://doi.org/10.1073/pnas.0711863105</u></li> 
			
			<li><div class="refnum">21.</div> Kowiański, P., Lietzau, G., Czuba, E., Waśkow, M., Steliga, A., 
			& Moryś, J. (2018). BDNF: A Key Factor with Multipotent Impact on Brain Signaling and Synaptic Plasticity. 
			<i>Cellular and molecular neurobiology, 38</i>(3), 579–593. <u>https://doi.org/10.1007/s10571-017-0510-4</u></li>
			
			<li><div class="refnum">22.</div> Kowiański, P., Lietzau, G., Czuba, E., Waśkow, M., Steliga, A., 
			& Moryś, J. (2018). BDNF: A Key Factor with Multipotent Impact on Brain Signaling and Synaptic 
			Plasticity. <i>Cellular and molecular neurobiology, 38</i>(3), 579–593. <u>https://doi.org/10.1007/s10571-017-0510-4</u></li>
			
			<li><div class="refnum">23.</div> Hu, B., Nikolakopoulou, A. M., & Cohen-Cory, S. (2005). 
			BDNF stabilizes synapses and maintains the structural complexity of optic axons in vivo.</li> 
			 
			<li><div class="refnum">24.</div> Sanchez-Roman, I., Ferrando, B., Holst, C. M., Mengel-From, J., 
			Rasmussen, S. H., Thinggaard, M., Bohr, V. A., Christensen, K., & Stevnsner, T. (2022). Molecular 
			markers of DNA repair and brain metabolism correlate with cognition in centenarians. <i>GeroScience, 
			44</i>(1), 103–125. <u>https://doi.org/10.1007/s11357-021-00502-2</u></li> 
			
			<li><div class="refnum">25.</div> Weinstein, G., Beiser, A. S., Choi, S. H., Preis, S. R., Chen, T. C., 
			Vorgas, D., Au, R., Pikula, A., Wolf, P. A., DeStefano, A. L., Vasan, R. S., & Seshadri, S. (2014). 
			Serum brain-derived neurotrophic factor and the risk for d******a: the Framingham Heart Study. 
			<i>JAMA neurology, 71</i>(1), 55–61. <u>https://doi.org/10.1001/jamaneurol.2013.4781</u></li>
			
			<li><div class="refnum">26.</div> Molteni, R., Barnard, R. J., Ying, Z., Roberts, C. K., & Gómez-Pinilla, 
			F. (2002). A high-fat, refined sugar diet reduces hippocampal brain-derived neurotrophic factor, 
			neuronal plasticity, and learning. <i>Neuroscience, 112</i>(4), 803-814.</li> 
			
			<li><div class="refnum">27.</div> Payton, L. T. (2024, June 14). <i>Your brain starts shrinking after 30. 
			what you need to do next to Keep your mind sharp and clear.</i> Fortune Well. 
			<u>https://fortune.com/well/2023/06/03/brain-shrinking/</u> </li>
			
			<li><div class="refnum">28.</div> Kowiański, P., Lietzau, G., Czuba, E. et al. BDNF: A Key Factor 
			with Multipotent Impact on Brain Signaling and Synaptic Plasticity. <i>Cell Mol Neurobiol</i> 38, 579–593 (2018). 
			<u>https://doi.org/10.1007/s10571-017-0510-4</u></li> 
			
			<li><div class="refnum">29.</div> Xue, B., Waseem, S. M. A., Zhu, Z., Alshahrani, M. A., Nazam, N., 
			Anjum, F., ... & Sharma, M. (2022). Brain-derived neurotrophic factor: a connecting link between 
			nutrition, lifestyle, and A*******'s disease. <i>Frontiers in Neuroscience, 16</i>, 925991.</li> 
			
			<li><div class="refnum">30.</div> Ng, T. K. S., Ho, C. S. H., Tam, W. W. S., Kua, E. H., & Ho, R. C. 
			(2019). Decreased Serum Brain-Derived Neurotrophic Factor (BDNF) Levels in Patients with a********'s 
			Disease (AD): A Systematic Review and Meta-Analysis. <i>International journal of molecular sciences, 
			20</i>(2), 257. <u>https://doi.org/10.3390/ijms20020257</u> </li> 
			
			<li><div class="refnum">31.</div> Budni, J., Bellettini-Santos, T., Mina, F., Garcez, M. L., 
			& Zugno, A. I. (2015). The involvement of BDNF, NGF and GDNF in aging and a********'s disease. 
			<i>Aging and disease, 6</i>(5), 331–341. <u>https://doi.org/10.14336/AD.2015.0825</u></li>
			
			<li><div class="refnum">32.</div> Lee, J. G., Shin, B. S., You, Y. S., Kim, J. E., Yoon, S. W., 
			Jeon, D. W., Baek, J. H., Park, S. W., & Kim, Y. H. (2009). Decreased serum brain-derived neurotrophic 
			factor levels in elderly korean with d******a. <i>Psychiatry investigation, 6</i>(4), 299–305. 
			<u>https://doi.org/10.4306/pi.2009.6.4.299</u></li>
			
			<li><div class="refnum">33.</div> Laske, C., Stransky, E., Leyhe, T., Eschweiler, G. W., Maetzler, W., 
			Wittorf, A., ... & Schott, K. (2007). BDNF serum and CSF concentrations in A*******'s disease, 
			normal pressure hydrocephalus and healthy controls. <i>Journal of psychiatric research, 41</i>(5), 387-394.</li> 
			 
			<li><div class="refnum">34.</div> Forlenza, O. V., Diniz, B. S., Teixeira, A. L., Ojopi, E. B., 
			Talib, L. L., Mendonça, V. A., … Gattaz, W. F. (2010). Effect of brain-derived neurotrophic factor 
			Val66Met polymorphism and serum levels on the progression of mild cognitive impairment. <i>The World 
			Journal of Biological Psychiatry, 11</i>(6), 774–780. <u>https://doi.org/10.3109/15622971003797241</u></li> 
			
			<li><div class="refnum">35.</div> Diniz, B. S., & Teixeira, A. L. (2011). Brain-derived 
				neurotrophic factor and a********'s disease: physiopathology and beyond. <i>Neuromolecular medicine, 
				13</i>(4), 217–222. <u>https://doi.org/10.1007/s12017-011-8154-x</u></li>                   
		
			<li><div class="refnum">36.</div> Nilsson, J., Ekblom, Ö., Ekblom, M. et al. Acute increases in 
			brain-derived neurotrophic factor in plasma following physical exercise relates to subsequent 
			learning in older adults. Sci Rep 10, 4395 (2020). <u>https://doi.org/10.1038/s41598-020-60124-0</u></li>  
			 
			<li><div class="refnum">37.</div> Glazachev, O. S., Zapara, M. A., Dudnik, E. N., Samartseva, V. G., 
			& Susta, D. (2020). Repeated hyperthermia exposure increases circulating Brain Derived Neurotrophic 
			Factor levels which is associated with improved quality of life, and reduced a******: 
			A randomized controlled trial. <i>Journal of Thermal Biology, 89</i>, 102482.</li>
				
			<li><div class="refnum">38.</div> Seager, T. (2024, July 4). <i>How to boost your brain: 
			Morozko ice bath science</i>. Morozko Forge. 
			<u>https://www.morozkoforge.com/post/ice-bath-brain-health-1#:~:text=Whole%20body%20cold%20water%20immersion,and%20better%20brain%20blood%20flow</u>  </li>  
			 
			<li><div class="refnum">39.</div> Glazachev, O. S., Zapara, M. A., Dudnik, E. N., Samartseva, V. G., 
			& Susta, D. (2020). Repeated hyperthermia exposure increases circulating Brain Derived Neurotrophic 
			Factor levels which is associated with improved quality of life, and reduced a******: 
			A randomized controlled trial. <i>Journal of Thermal Biology, 89</i>, 102482.</li> 
				
			<li><div class="refnum">40.</div> Cahn, B. R., Goodman, M. S., Peterson, C. T., Maturi, R., 
			& Mills, P. J. (2017). Yoga, Meditation and Mind-Body Health: Increased BDNF, Cortisol Awakening Response, 
			and Altered Inflammatory Marker Expression after a 3-Month Yoga and Meditation Retreat. 
			<i>Frontiers in human neuroscience, 11</i>, 315. <u>https://doi.org/10.3389/fnhum.2017.00315</u></li>  
			
			<li><div class="refnum">41.</div> Huang, F., Shang, Y., Luo, Y., Wu, P., Huang, X., Tan, X., 
			Lu, X., Zhen, L., & Hu, X. (2016). Lower Prevalence of a********'s Disease among Tibetans: 
			Association with Religious and Genetic Factors. <i>Journal of a********'s disease : 
			JAD, 50</i>(3), 659–667. <u>https://doi.org/10.3233/JAD-150697</u></li>
			
			<li><div class="refnum">42.</div> Gómez-Pinilla F. (2008). Brain foods: the effects of 
			nutrients on brain function. <i>Nature reviews. Neuroscience, 9</i>(7), 568–578. <u>https://doi.org/10.1038/nrn2421</u></li>
			
			<li><div class="refnum">43.</div> Zeeni, N., Haidar, E. A., Azar, A., Ghanem, A., Bassil, 
			K., Bassil, M., & Sleiman, S. (2017). The combinatory effects of diet and exercise on BDNF 
			gene expression. <i>The FASEB Journal</i>, 31, 150-8.</li> 
			 
			<li><div class="refnum">44.</div> Sangiovanni, E., Brivio, P., Dell'Agli, M., & Calabrese, F. (2017). 
			Botanicals as Modulators of Neuroplasticity: Focus on BDNF. <i>Neural plasticity, 2017</i>, 5965371. 
			<u>https://doi.org/10.1155/2017/5965371</u></li> 
			
			<li><div class="refnum">45.</div> Hasselmo, M. E., & Bower, J. M. (1993). Acetylcholine and memory. 
			<i>Trends in neurosciences, 16</i>(6), 218–222. <u>https://doi.org/10.1016/0166-2236(93)90159-j</u> </li>
			
			<li><div class="refnum">46.</div> Walker, E. A., & Pellegrini, M. V. (2023). Bacopa monnieri. In <i>StatPearls</i>. StatPearls Publishing.</li> 
			
			<li><div class="refnum">47.</div> Zhang, X., Feng, D., Barry, D., & Li, J. (2024). Closed-loop 
			control of gamma oscillations in the brain connections through the transcranial stimulations. 
			arXiv preprint <i>arXiv:2403.06794</i>.</li>
			
			<li><div class="refnum">48.</div> Ross, B., & Lopez, M. D. (2020). 40-Hz Binaural beats 
			enhance training to mitigate the attentional blink. <i>Scientific reports, 10</i>(1), 7002. 
			<u>https://doi.org/10.1038/s41598-020-63980-y</u></li> 
			
			<li><div class="refnum">49.</div> Zhang, X., Feng, D., Barry, D., & Li, J. (2024). Closed-loop 
			control of gamma oscillations in the brain connections through the transcranial stimulations. 
			<i>arXiv preprint arXiv:2403.06794</i>.</li> 

			<li><div class="refnum">50.</div> Kowiański, P., Lietzau, G., Czuba, E., Waśkow, M., Steliga, 
			A., & Moryś, J. (2018). BDNF: A Key Factor with Multipotent Impact on Brain Signaling and Synaptic 
			Plasticity. <i>Cellular and molecular neurobiology, 38</i>(3), 579–593. <u>https://doi.org/10.1007/s10571-017-0510-4</u></li> 
			
			<li><div class="refnum">51.</div> Hu, B., Nikolakopoulou, A. M., & Cohen-Cory, S. (2005). 
			BDNF stabilizes synapses and maintains the structural complexity of optic axons in vivo.</li>
			
			<li><div class="refnum">52.</div> Kowiański, P., Lietzau, G., Czuba, E., Waśkow, M., Steliga, 
			A., & Moryś, J. (2018). BDNF: A Key Factor with Multipotent Impact on Brain Signaling and 
			Synaptic Plasticity. <i>Cellular and molecular neurobiology, 38</i>(3), 
			579–593. <u>https://doi.org/10.1007/s10571-017-0510-4</u></li>

			<li><div class="refnum">53.</div> <i>Lisa M. Monteggia, ph.D..</i> Lisa M. Monteggia, Ph.D. | 
			Brain & Behavior Research Foundation. (2023, May 25). <u>https://bbrfoundation.org/about/people/lisa-m-monteggia-phd</u> </li> 

			<li><div class="refnum">54.</div> Bekinschtein, P., Cammarota, M., Katche, C., Slipczuk, L., 
			Rossato, J. I., Goldin, A., Izquierdo, I., & Medina, J. H. (2008). BDNF is essential to promote 
			persistence of long-term memory storage. <i>Proceedings of the National Academy of Sciences of the 
			United States of America, 105</i>(7), 2711–2716. <u>https://doi.org/10.1073/pnas.0711863105</u></li> 
	</ul>
	`;
									
	const refRight =	`
		<ul class="ref-list">			
			<li><div class="refnum">55.</div> Weinstein, G., Beiser, A. S., Choi, S. H., Preis, S. R., Chen, T. C., 
			Vorgas, D., Au, R., Pikula, A., Wolf, P. A., DeStefano, A. L., Vasan, R. S., & Seshadri, S. (2014). 
			Serum brain-derived neurotrophic factor and the risk for d******a: the Framingham Heart Study. <i>JAMA neurology</i>, 71(1), 55–61. <u>https://doi.org/10.1001/jamaneurol.2013.4781</u></li>
			
			<li><div class="refnum">56.</div> Sanchez-Roman, I., Ferrando, B., Holst, C. M., 
			Mengel-From, J., Rasmussen, S. H., Thinggaard, M., Bohr, V. A., Christensen, K., & Stevnsner, 
			T. (2022). Molecular markers of DNA repair and brain metabolism correlate with cognition in 
			centenarians. <i>GeroScience, 44</i>(1), 103–125. <u>https://doi.org/10.1007/s11357-021-00502-2</u></li> 
			
			<li><div class="refnum">57.</div> Payton, L. T. (2024, June 14). <i>Your brain starts 
			shrinking after 30. what you need to do next to Keep your mind sharp and clear</i>. 
			Fortune Well. <u>https://fortune.com/well/2023/06/03/brain-shrinking/</u></li>
			
			<li><div class="refnum">58.</div> Binder, D. K., & Scharfman, H. E. (2004). Brain-derived neurotrophic factor. 
			<i>Growth factors (Chur, Switzerland), 22</i>(3), 123–131. <u>https://doi.org/10.1080/08977190410001723308</u></li> 
			
			<li><div class="refnum">59.</div> Bathina, S., & Das, U. N. (2015). Brain-derived neurotrophic 
			factor and its clinical implications. <i>Archives of medical science : AMS, 11</i>(6), 1164–1178. 
			<u>https://doi.org/10.5114/aoms.2015.56342</u></li> 
			
			<li><div class="refnum">60.</div> <i>BDNF: How meditation may prevent a*******'s & d******a</i>. 
			EOC Institute. (n.d.). <u>https://eocinstitute.org/meditation/bdnf-how-meditation-prevents-a*******'s-disease-d******a/</u>  </li> 
			
			<li><div class="refnum">61.</div> Nilsson, J., Ekblom, Ö., Ekblom, M. et al. Acute increases in 
			brain-derived neurotrophic factor in plasma following physical exercise relates to subsequent 
			learning in older adults. <i>Sci Rep</i> 10, 4395 (2020). <u>https://doi.org/10.1038/s41598-020-60124-0</u> </li>
			
			<li><div class="refnum">62.</div> Cahn, B. R., Goodman, M. S., Peterson, C. T., Maturi, R., & Mills, 
			P. J. (2017). Yoga, Meditation and Mind-Body Health: Increased BDNF, Cortisol Awakening Response, 
			and Altered Inflammatory Marker Expression after a 3-Month Yoga and Meditation Retreat. 
			<i>Frontiers in human neuroscience, 11</i>, 315. <u>https://doi.org/10.3389/fnhum.2017.00315</u></li>
			
			<li><div class="refnum">63.</div> Staff, R. T., Hogan, M. J., Williams, D. S., & Whalley, L. J. (2018). 
			Christmas 2018: Time After Time: Intellectual engagement and cognitive ability in later life 
			(the “use it or lose it” conjecture): longitudinal, prospective study. <i>The BMJ, 363</i>. </li> 
			 
			<li><div class="refnum">64.</div> Payton, L. T. (2024, June 14). <i>Your brain starts shrinking 
			after 30. what you need to do next to Keep your mind sharp and clear</i>. Fortune Well. 
			<u>https://fortune.com/well/2023/06/03/brain-shrinking/</u></li> 
			
			<li><div class="refnum">65.</div> Molendijk, M. L., Haffmans, J. P., Bus, B. A., Spinhoven, P., 
			Penninx, B. W., Prickaerts, J., Oude Voshaar, R. C., & Elzinga, B. M. (2012). Serum BDNF 
			concentrations show strong seasonal variation and correlations with the amount of ambient 
			sunlight. <i>PloS one, 7</i>(11), e48046. <u>https://doi.org/10.1371/journal.pone.0048046</u></li>
			
			<li><div class="refnum">66.</div> Ross, B., & Lopez, M. D. (2020). 40-Hz Binaural beats 
			enhance training to mitigate the attentional blink. <i>Scientific reports, 10</i>(1), 7002. 
			<u>https://doi.org/10.1038/s41598-020-63980-y</u></li> 
			
			<li><div class="refnum">67.</div> Martorell, A. J., Paulson, A. L., Suk, H. J., Abdurrob, F., 
			Drummond, G. T., Guan, W., Young, J. Z., Kim, D. N., Kritskiy, O., Barker, S. J., Mangena, V., 
			Prince, S. M., Brown, E. N., Chung, K., Boyden, E. S., Singer, A. C., & Tsai, L. H. 
			(2019). Multi-sensory Gamma Stimulation Ameliorates a********'s-Associated Pathology and 
			Improves Cognition. <i>Cell, 177</i>(2), 256–271.e22. <u>https://doi.org/10.1016/j.cell.2019.02.014</u></li>
			
			<li><div class="refnum">68.</div> Zhang, X., Feng, D., Barry, D., & Li, J. (2024). Closed-loop 
			control of gamma oscillations in the brain connections through the transcranial stimulations. <i>arXiv 
			preprint arXiv:2403.06794</i>.</li> 
			
			<li><div class="refnum">69.</div> Reedijk, S. A., Bolders, A., & Hommel, B. (2013). The impact of 
			binaural beats on creativity. <i>Frontiers in human neuroscience, 7,</i> 786.</li> 
			
			<li><div class="refnum">70.</div> More, S. S., Vartak, A. P., & Vince, R. (2012). The butter 
			flavorant, diacetyl, exacerbates β-a****** cytotoxicity. <i>Chemical research in toxicology, 25</i>(10), 
			2083–2091. <u>https://doi.org/10.1021/tx3001016</u> </li>
			
			<li><div class="refnum">71.</div> Weinstein, G., Seshadri, S., & Wolf, P. A. (2014). Serum brain-derived neurotrophic factor and the risk for d*******: The Framingham Heart Study. JAMA Neurology, 71(1), 55-61. <u>https://doi.org/10.1001/jamaneurol.2013.4781</u> </li>

			<li><div class="refnum">72.</div> Herculano-Houzel, S. (2009). The human brain in numbers: A linearly scaled-up primate brain. Frontiers in Human Neuroscience, 3, 31. <u>https://doi.org/10.3389/neuro.09.031.2009</u> </li>

			<li><div class="refnum">73.</div> Ben-Yakov, A., Dudai, Y., & Mayford, M. R. (2015). Memory retrieval in mice and men. Cold Spring Harbor Perspectives in Biology, 7(12), a021790. <u>https://doi.org/10.1101/cshperspect.a021790</u> </li>
			
			<li><div class="refnum">74.</div> Boseley, S. (2012, January 5). Memory l*** can begin from age 45, scientists say. The Guardian. <u>https://www.theguardian.com/science/2012/jan/06/memory-loss-begins-at-45-says-study</u> </li>

			<li><div class="refnum">75.</div> Nisa, F. Y., Rahman, M. A., Hossen, M. A., Khan, M. F., Khan, M. A. N., Majid, M., Sultana, F., & Haque, M. A. (2021). Role of neurotoxicants in the pathogenesis of A********** disease: A mechanistic insight. Annals of Medicine, 53(1), 1479–1504. <u>https://doi.org/10.1080/07853890.2021.1966088</u> </li>

			<li><div class="refnum">76.</div> Chin-Chan, M., Navarro-Yepes, J., & Quintanilla-Vega, B. (2015). Environmental pollutants as risk factors for neurodegenerative disorders: A******** and P******** d********. Frontiers in Cellular Neuroscience, 9, 124. <u>https://doi.org/10.3389/fncel.2015.00124</u> </li>

			<li><div class="refnum">77.</div> More, S. V., Kumar, H., Cho, D.-Y., Yun, Y.-S., & Choi, D.-K. (2016). Toxin-induced experimental models of learning and memory impairment. International Journal of Molecular Sciences, 17(9), 1447. <u>https://doi.org/10.3390/ijms17091447</u> </li>

			<li><div class="refnum">78.</div> Chen, L., Na, R., Ran, Q. (2015). NLRP3 inflammasome activation by mitochondrial reactive oxygen species plays a key role in long-term cognitive impairment induced by paraquat exposure. Neurobiology of Aging, 36(9), 2533-2543. <u>https://doi.org/10.1016/j.neurobiolaging.2015.05.018</u> </li>

			<li><div class="refnum">79.</div> Neumann, H., Kotter, M. R., & Franklin, R. J. M. (2008). Debris clearance by microglia: an essential link between degeneration and regeneration. Brain, 132(2), 288–295., <u>doi.org/10.1093/brain/awn109</u> </li>

			<li><div class="refnum">80.</div> Kraft, A. D., & Harry, G. J. (2011). Features of microglia and neuroinflammation relevant to environmental exposure and neurotoxicity. International Journal of Environmental Research and Public Health, 8(7), 2980-3018. <u>https://doi.org/10.3390/ijerph8072980</u> </li>

			<li><div class="refnum">81.</div> Libby, P. (2007). Inflammatory Mechanisms: The Molecular Basis of Inflammation and Disease. <em>The New England Journal of Medicine</em>, 356(5), 429-430.</u> </li>
			
			
			<li><div class="refnum">82.</div> Freitas, R. M., Oliveira, A. C. P., & Oliveira, A. F. M. (2017). Oxidative stress in migraine. <em>Oxidative Medicine and Cellular Longevity</em>, 2017.</u> </li>
			
			
			<li><div class="refnum">83.</div> Kreisel, T., Frank, M. G., Licht, T., Reshef, R., Ben-Menachem-Zidon, O., & Yirmiya, R. (2014). Dynamic microglial alterations underlie stress-induced depressive-like behavior and suppressed neurogenesis. <em>Molecular Psychiatry</em>, 19(6), 699-709.</u> </li>
			

			<li><div class="refnum">84.</div> Virginia Department of Health. (n.d.). Bisphenol A (BPA). Retrieved October 16, 2024, from <u>https://www.vdh.virginia.gov/environmental-health/public-health-toxicology/bisphenol-a/</u> </li>
			
			
			<li><div class="refnum">85.</div> Hamblin, J. (2014, March 18). The toxins that threaten our brains. The Atlantic. <u>https://www.theatlantic.com/health/archive/2014/03/the-toxins-that-threaten-our-brains/284466/</u> </li>
			
			
			<li><div class="refnum">86.</div> National Institute on Aging. (2021, March 16). Direct link shown between brain inflammation, neuron death, and cognitive changes in mice. National Institutes of Health (NIH). <u>https://www.nia.nih.gov/news/direct-link-shown-between-brain-inflammation-neuron-death-and-cognitive-changes-mice</u> </li>
			
			
			<li><div class="refnum">87.</div> Vellinga, J. (2021, January 26). Neurotoxins: Cause, effect, and prevention. Temecula Center for Integrative Medicine. Retrieved from <u>https://www.tcimedicine.com/post/neurotoxins-cause-effect-and-prevention</u> </li>
			
			
			<li><div class="refnum">88.</div> Wise-Answer. (n.d.). Can neurotoxins cause hair loss? Retrieved from <u>https://wise-answer.com/can-neurotoxins-cause-hair-loss/</u> </li>
			
			
			<li><div class="refnum">89.</div> Dawson, T. M., & Beal, M. F. (1993). Excitotoxins, aging, and environmental neurotoxins: Implications for P********** disease. Semanticscholar. Retrieved from <u>https://www.semanticscholar.org/paper/Excitotoxins%2C-aging%2C-and-environmental-neurotoxins%3A-Dawson-Beal/25f8bdd36cb2645cd630881cac71f8e1d573dc68</u> </li>
			
			
			<li><div class="refnum">90.</div> Cannon, J. R., & Greenamyre, J. T. (2011). The role of environmental exposures in neurodegeneration and P********* disease. Semanticscholar. Retrieved from <u>https://www.semanticscholar.org/paper/The-role-of-environmental-exposures-in-and-Cannon-Greenamyre/1d33ba5a291a1fdb5962f69f2f0f37660dedfd1c</u> </li>
			
			
			<li><div class="refnum">91.</div> Dawson, T. M., & Dawson, V. L. (2003). Molecular pathways of neurodegeneration in P********** disease. Journal of Clinical Investigation, 111(2), 145-151. <u>https://pubmed.ncbi.nlm.nih.gov/12900082/</u> </li>
			
			
			<li><div class="refnum">92.</div> Knoll, S. (2015, March 21). Harmful chemicals and neurotoxins: Silently eroding intelligence, damaging societies. Journalist's Resource. Retrieved from <u>https://journalistsresource.org/environment/neurobehavioral-effects-developmental-toxicity/</u> </li>
			
			
			<li><div class="refnum">93.</div> Olmedillas del Moral, M., Fröhlich, N., A. Garaschuk, O. (2020). Effect of caloric restriction on the in vivo functional properties of aging microglia. Frontiers in Immunology, 11, Article 750. <u>https://doi.org/10.3389/fimmu.2020.00750</u> </li>
			
			
			<li><div class="refnum">94.</div> Laukkanen, T., Kunutsor, S., & Laukkanen, J. (2017). Sauna bathing is inversely associated with d******* and A********** disease in middle-aged Finnish men. Age and Ageing. <u>https://doi.org/10.1093/ageing/afw212</u> </li>
			
			
			<li><div class="refnum">95.</div> Sanchez-Roman, I., Ferrando, B., Holst, C. M., Mengel-From, J., Rasmussen, S. H., Thinggaard, M., Bohr, V. A., Christensen, K., & Stevnsner, T. (2021). Molecular markers of DNA repair and brain metabolism correlate with cognition in centenarians. GeroScience, 44(1), 103–125. <u>https://doi.org/10.1007/s11357-021-00502-2</u> </li>
			
			
			<li><div class="refnum">96.</div> Bekinschtein, P., Cammarota, M., Katche, C., Slipczuk, L., Rossato, J. I., Goldin, A., Izquierdo, I., & Medina, J. H. (2008). BDNF is essential to promote persistence of long-term memory storage. Proceedings of the National Academy of Sciences, 105(7), 2711–2716. <u>https://doi.org/10.1073/pnas.0711863105</u> </li>
			
			
			<li><div class="refnum">97.</div> Hu, B., Nikolaoukouplou, A. M., & Cohen-Cory, S. (2005). BDNF stabilizes synapses and maintains the structural complexity of optic axons in vivo. Development, 132(19), 4285–4298. <u>https://doi.org/10.1242/dev.02017</u> </li>
			
			
			<li><div class="refnum">98.</div> Kowański, P., Lietzau, G., Czuba, E., Waśkow, M., Steliga, A., & Moryś, J. (2017). BDNF: A key factor with multipotent impact on brain signaling and synaptic plasticity. Cellular and Molecular Neurobiology, 38(3), 579–593. <u>https://doi.org/10.1007/s10571-017-0510-4</u> </li>
			
			
			<li><div class="refnum">99.</div> Weinstein, G., Beiser, A. S., Choi, S. H., Preis, S. R., Chen, T. C., Vorgas, D., Au, R., Pikula, A., Wolf, P. A., DeStefano, A. L., Vasan, R. S., & Seshadri, S. (2014). Serum Brain-Derived Neurotrophic Factor and the Risk for D*******: The Framingham Heart Study. JAMA Neurology, 71(1), 55–61. <u>https://doi.org/10.1001/jamaneurol.2013.4781</u> </li>
			
			
			<li><div class="refnum">100.</div> Zhang, X., Feng, D., Barry, D., & Li, J. (2024). Closed-loop control of gamma oscillations in the brain connections through transcranial stimulations. arXiv. <u>https://arxiv.org/pdf/2403.06794.pdf</u> </li>
			
			
			<li><div class="refnum">101.</div> Staff, R. T., Hogan, M. J., Williams, D. S., & Whalley, L. J. (2018). Intellectual engagement and cognitive ability in later life (the "use it or lose it" conjecture): Longitudinal, prospective study. BMJ, 363, k4925. <u>https://doi.org/10.1136/bmj.k4925</u> </li>
			
			
			<li><div class="refnum">102.</div> Cantero, J. L., Atienza, M., Madsen, J. R., & Stickgold, R. (2004). Gamma EEG dynamics in neocortex and hippocampus during human wakefulness and sleep. NeuroImage, 22(3), 1271–1280., <u>doi.org/10.1016/j.neuroimage.2004.03.014</u> </li>
			
			
			<li><div class="refnum">103.</div> Monteiro, B. C., Monteiro, S., Candida, M., Adler, N., Paes, F., Rocha, N., Nardi, A. E., Murillo-Rodriguez, E., & Machado, S. (2017). Relationship Between Brain-Derived Neurotrophic Factor (Bdnf) and Sleep on Depression: A Critical Review. Clinical Practice & Epidemiology in Mental Health, 13, 213–219. <u>https://doi.org/10.2174/1745017901713010213</u> </li>
			
			
			<li><div class="refnum">104.</div> Schubert, R., Paulsen, A. J., Pinto, A., Alex MS, Chapell, J., PhD⁴, Chen, Yanjun MD, PhD⁵, Ferrucci, Luigi MD, PhD, Hancock, Laura M. PhD⁴, Cruickshanks, Karen J. PhD⁴, Merten, Natasha PhD, MS⁴, & PhD, "⁴". (2023). Effect of neurotoxin exposure on blood biomarkers of neurodegeneration and Alzheimer disease. Alzheimer Disease & Associated Disorders, 37(4), 310-314. <u>https://doi.org/10.1097/WAD.0000000000000579</u> </li>
			
			
			<li><div class="refnum">105.</div> Consumer Reports. (2013, October 3). Arsenic in your juice: How much is too much? Federal limits don’t exist. <u>https://www.consumerreports.org/arsenic-in-food/arsenic-in-your-juice-apple-juice-grape-juice/</u> </li>
			
			
			<li><div class="refnum">106.</div> Lanphear, B. P., Navas-Acien, A., Bellinger, D. C., & Hardin, C. C. (2024). Lead poisoning. The New England Journal of Medicine, 390(19), 1621-1631. <u>https://doi.org/10.1056/NEJMra2402527</u> </li>
			
			
			<li><div class="refnum">107.</div> Roberts, C. (2024, April 18). We found unhealthy pesticide levels in 20% of US produce – here’s what you need to know. The Guardian. <u>https://www.theguardian.com/environment/2024/apr/18/what-pesticide-safety-organic-fruits-vegetables-us</u> </li>


		</ul>
		<style>.refnum{width:26px;}</style>
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
	<div>
		
	</div>
	`;
	
	list = document.getElementsByClassName("testiquotes");
	for (var i=0; i<list.length; i++) { list[i].innerHTML = testis };
}
references();
