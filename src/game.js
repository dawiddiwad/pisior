//Game.start();
window.onload = yolo();

function ladowanieAssetow() {
	console.log(Math.atan(1));

	var postepLadowania = 0;
	var pasekPostepu = document.getElementById('ladowacz');
	var tabelaWyniki = document.getElementById('wyniki');
	var Pole_Gry = document.getElementById('Pole_Gry');
	Pole_Gry.style.visibility = 'hidden';
	tabelaWyniki.style.visibility = 'hidden';
	pasekPostepu.innerHTML = postepLadowania + "%";
	//ładowanie wstępne:
	var assety = new Array();
	assety.push('assets/obrazki/boss1.png');
	assety.push('assets/obrazki/boss2.png');
	assety.push('assets/obrazki/boss3.png');
	assety.push('assets/obrazki/boss4.png');
	assety.push('assets/obrazki/boss5.png');
	assety.push('assets/obrazki/explode.gif');
	assety.push('assets/obrazki/explode.png');
	assety.push('assets/obrazki/hit.gif');
	assety.push('assets/obrazki/ouch2.png');
	assety.push('assets/obrazki/penisdogifa.gif');
	assety.push('assets/obrazki/penisdogifa.png');
	assety.push('assets/obrazki/rebull.png');
	assety.push('assets/obrazki/tlo.jpg');
	assety.push('assets/obrazki/wrog.png');
	assety.push('assets/obrazki/zycie.png');
	assety.push('assets/audio/theme.mid');
	assety.push('assets/audio/theme.mp3');
	assety.push('assets/audio/theme.ogg');
	assety.push('assets/audio/theme.wav');
	var assetyZaladowane = new Array();
	var loader = 0;


	function ladujAssety() {

		if (loader < assety.length) {

			if (assety[loader].indexOf('obrazki') !== -1) {
				assetyZaladowane[loader] = new Image();
				assetyZaladowane[loader].src = assety[loader];
				assetyZaladowane[loader].onload = function () {
					console.log('załadowano ' + assety[loader]);
					postepLadowania = Math.round((loader + 1) / assety.length * 100);
					pasekPostepu.innerHTML = postepLadowania + "%";
					loader++;
					ladujAssety();
				}
				assetyZaladowane[loader].onerror = function () {
					console.log("błąd ładowania " + assety[loader]);
					loader++;
					ladujAssety();
				}

			} else if (assety[loader].indexOf('audio') !== -1) {
				assetyZaladowane[loader] = new Audio(assety[loader]);
				//assetyZaladowane[loader].src = assety[loader];
				assetyZaladowane[loader].oncanplaythrough = function () {
					console.log('załadowano ' + assety[loader]);
					postepLadowania = Math.round((loader + 1) / assety.length * 100);
					pasekPostepu.innerHTML = postepLadowania + "%";
					loader++;
					ladujAssety();
				}
				assetyZaladowane[loader].onerror = function () {
					console.log("błąd ładowania " + assety[loader]);
					postepLadowania = Math.round((loader + 1) / assety.length * 100);
					pasekPostepu.innerHTML = postepLadowania + "%";
					loader++;
					ladujAssety();
				}
			} else {
				console.log("nieznany asset " + assety[loader]);
				postepLadowania = Math.round((loader + 1) / assety.length * 100);
				pasekPostepu.innerHTML = postepLadowania + "%";
				loader++;
				ladujAssety();
			}
		} else {
			console.log("asetki załadowane");
			Pole_Gry.style.visibility = 'visible';
			tabelaWyniki.style.visibility = 'visible';
			Game.start();
		}
	}
	ladujAssety();
}
function yolo() {



	//inicjalizacja gry:
	Game = {
		start: function () {

			//zabawa padem:
			window.addEventListener("gamepadconnected", function (e) {
				console.log("gamepad connected at index %d: %s. %d buttons, %d axes.",
					e.gamepad.index, e.gamepad.id,
					e.gamepad, buttons.length, e.gamepad.axes.length);
			});

			/*
			//początkowe dostosowanie wielkości pola gry do ekranu:
			if (window.innerWidth >= 600) {
				document.body.style.zoom = (window.innerHeight / 450) * 90 + '%';
			} else {
				document.body.style.zoom = (window.innerWidth / 600) * 90 + '%';
			}
			*/

			//sprawdzanie czy IE:
			if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/))) {
				//console.log("IE!");
				var DD_mnożnikPartykle = 0.7;
			} else {
				var DD_mnożnikPartykle = 1;
			}



			//inicjacja sceny
			var pasekPostepu = document.getElementById('ladowacz');
			pasekPostepu.style.display = 'none';
			var scena = document.getElementById('Pole_Gry');
			var gra = document.getElementById('gra');
			Crafty.init(500, 300, scena);

			//----WIDOK----//
			//przewiń widok na pozycję sceny:
			Crafty.e("Delay").delay(function () {
				scrollTo(document.body, gra.offsetTop - 20);
				Crafty.viewport.reload();
			}, 100, 0);

			//wyłącz przewijanie strzałkami/spacją:
			window.addEventListener('keydown', function (e) {
				if ((e.keyCode == 32
					|| e.keyCode == 38
					|| e.keyCode == 40
					|| e.keyCode == 37
					|| e.keyCode == 39)
					&& e.target == document.body) {
					e.preventDefault();
				}
			});

			/*
			//dostosowanie wielkości pola gry do ekranu przy zmainie rozmiaru okna:
			window.onresize = function (event) {
				if (window.innerWidth >= 600) {
					document.body.style.zoom = (window.innerHeight / 450) * 100 + '%'; 
					scrollTo(document.body, (gra.offsetTop - 20) * window.innerHeight / 450);
				} else {
					document.body.style.zoom = (window.innerWidth / 600) * 100 + '%';
					scrollTo(document.body, (gra.offsetTop - 20) * window.innerHeight / 450);
				}
			};
			*/
			//--------//



			//inicjalizacja zmiennych globalnych gry:
			var DD_graczPoczatkoweZycie = 5; //poczatkowe zycie gracza
			zmienZycieGracza(DD_graczPoczatkoweZycie, '+');
			var DD_tlo_y = 0; //bufor na odleglosc y obrazka tla
			var DD_bufor = 0; //bufor klatek dla przerw miedzy strzalami
			var DD_buforStrzalu = 6; //opoznienie klatek miedzy strzalami
			var DD_fala = 1; //licznik fal wrogow
			var DD_obrazy = 0; //licznik obraz prezesa ;)
			var DD_score = 0; //licznik punktow zdobytych przez gracza
			var DD_wystrzelonePociski = 0; //licznik wystrzelonych pociskow
			var DD_obrazeniaPocikskowGracz = 1; //poczatkowe obrazenia pociskow gracza
			var DD_predkoscPocztkowaGracza = 125; //prekosc poczatkowa gracza px/s

			//partykle opcje:
			//bonus zycie:
			var optionsBonusZycie = {
				maxParticles: 150 * DD_mnożnikPartykle,
				size: 5,
				sizeRandom: 1,
				speed: 3,
				speedRandom: 3,
				direction: 0,
				// Lifespan in frames
				lifeSpan: 3,
				lifeSpanRandom: 10,
				// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
				angle: 0,
				angleRandom: 360,
				startColour: [255, 255, 255, 100],
				startColourRandom: [0, 0, 0, 0],
				endColour: [255, 0, 0, 50],
				endColourRandom: [20, 0, 0, 0],
				// Only applies when fastMode is off, specifies how sharp the gradients are drawn
				sharpness: 100,
				sharpnessRandom: 10,
				// Random spread from origin
				spread: Math.random() * 5,
				// How many frames should this last
				duration: Math.random() * 10,
				// Will draw squares instead of circle gradients
				fastMode: false,
				gravity: { x: 0, y: 0.5 },
				// sensible values are 0-3
				jitter: 1,
				// Offset for the origin of the particles
				originOffset: { x: 0, y: 0 }
			}

			var optionsBonusRebull = {
				maxParticles: 150 * DD_mnożnikPartykle,
				size: 5,
				sizeRandom: 1,
				speed: 3,
				speedRandom: 3,
				direction: 0,
				// Lifespan in frames
				lifeSpan: 3,
				lifeSpanRandom: 10,
				// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
				angle: 0,
				angleRandom: 360,
				startColour: [255, 255, 255, 100],
				startColourRandom: [0, 0, 0, 0],
				endColour: [0, 0, 255, 50],
				endColourRandom: [0, 0, 20, 0],
				// Only applies when fastMode is off, specifies how sharp the gradients are drawn
				sharpness: 100,
				sharpnessRandom: 10,
				// Random spread from origin
				spread: Math.random() * 5,
				// How many frames should this last
				duration: Math.random() * 10,
				// Will draw squares instead of circle gradients
				fastMode: false,
				gravity: { x: 0, y: 0.5 },
				// sensible values are 0-3
				jitter: 1,
				// Offset for the origin of the particles
				originOffset: { x: 0, y: 0 }
			}

			//wczytanie tła:
			Crafty.background('url(assets/obrazki/tlo.jpg)');
			//przewijanie tla:
			Crafty.bind('EnterFrame', function (eventData) {
				document.getElementById('Pole_Gry').style.backgroundPosition = "0px " + DD_tlo_y + "px";
				DD_tlo_y++;
				if (DD_tlo_y > 300) { DD_tlo_y = 0; } //sprawdzenie czy licznik jest wiekszy niz polowa wysokosci obrazka tla
			})

			//dodanie glownego motywu muzycznego:
			Crafty.audio.add({
				theme: ["assets/audio/theme.wav",
					"assets/audio/theme.mp3",
					"assets/audio/theme.ogg"]

			});
			//uruchomienie glownego motywu muzycznego:
			Crafty.audio.play("theme", -1, 0.05);


			//----SPRAJTY----//
			//stworzenie sprite'a gracza:
			Crafty.sprite(50, "assets/obrazki/penisdogifa.png", {
				sprite_gracz: [],
			});

			//sprajt wybuchu:
			Crafty.sprite(60, "assets/obrazki/explode.png", {
				sprite_explode: []
			});
			//---------//


			//-----------------------------
			// GRACZ
			//-----------------------------
			//dodanie gracza:
			var gracz = Crafty.e("gracz, 2D, Canvas, sprite_gracz, SpriteAnimation, Twoway, Collision, Renderable")
				.collision([10, 0, 0, 50, 50, 50, 40, 0])
				//.image("assets/obrazki/penisdogifa.gif", "no-repeat")
				.reel('penis', 1000, 0, 0, 4)
				.animate('penis', -1)
				.twoway(DD_predkoscPocztkowaGracza)
				.attr({ x: parseInt(Crafty.stage.elem.style.width) / 2 - 25, y: parseInt(Crafty.stage.elem.style.height) - 50, w: 50, h: 50 })
				.bind('Moved', function (evt) { // after player moved
					if (this.x < 0 || this.x + this.w > parseInt(Crafty.stage.elem.style.width)) {
						this[evt.axis] = evt.oldValue;
						//console.log("sciana!");
					}
				})
				.bind("KeyUp", function (e) {
					//strzelanie:
					if (e.key == 32 || e.key == 38) {
						//console.log("wcisnieto klawisz strzalu!");
						strzal_gracz();
					}
				})
				;
			//ustawienie przezroczystości gracza:	
			gracz.alpha = 0.5;
			gracz.zycie = DD_graczPoczatkoweZycie;

			//obsluga strzelania:
			function strzal_gracz() {
				//opoznienie miedzy wystrzelonymi pociskami:
				if (Crafty.frame() < DD_bufor) { return; }
				DD_bufor = Crafty.frame() + DD_buforStrzalu;
				//dodanie pocisku gracza do sceny:
				var pocisk_gracza = Crafty.e("pocisk_gracza, 2D, Canvas, Color, Collision, Renderable, Motion")
					.attr({ x: gracz.x + 21, y: gracz.y - 10, w: 8, h: 10 })
					.color("red")
					.collision([0, 0, 0, 10, 8, 10, 8, 0])
					.origin('center')
					//kolizje z wrogami:
					.onHit('wrog', function (hitDatas) {
						for (var i = 0; i < hitDatas.length; i++) {
							//kontrola zycia wroga:
							hitDatas[i].obj.zycie -= DD_obrazeniaPocikskowGracz;
							if (hitDatas[i].obj.zycie <= 0) {

								//partykle wybuchu przy zniszczeniu wroga:
								//opcje partykli:
								Crafty("*").trigger("Explode");
								//otoczka wybuchu
								if (hitDatas[i].obj.boss) { //jezeli boss
									var optionsWrogOtoczka = {
										maxParticles: 200 * DD_mnożnikPartykle,
										size: 5,
										sizeRandom: 5,
										speed: 5,
										speedRandom: 5,
										direction: 50,
										// Lifespan in frames
										lifeSpan: 7,
										lifeSpanRandom: 50,
										// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
										angle: 0,
										angleRandom: 360,
										startColour: [255, 255, 255, 100],
										startColourRandom: [0, 0, 0, 0],
										endColour: [255, 95, 0, 0],
										endColourRandom: [10, 5, 0, 0],
										// Only applies when fastMode is off, specifies how sharp the gradients are drawn
										sharpness: 50,
										sharpnessRandom: 10,
										// Random spread from origin
										spread: Math.random() * 5,
										// How many frames should this last
										duration: Math.random() * 10,
										// Will draw squares instead of circle gradients
										fastMode: false,
										gravity: { x: 0, y: 0 },
										// sensible values are 0-3
										jitter: 2,
										// Offset for the origin of the particles
										originOffset: { x: 0, y: 0 }
									}
								} else { //jezeli minion
									var optionsWrogOtoczka = {
										maxParticles: 200 * DD_mnożnikPartykle,
										size: 3,
										sizeRandom: 3,
										speed: 4,
										speedRandom: 4,
										direction: 50,
										// Lifespan in frames
										lifeSpan: 5,
										lifeSpanRandom: 20,
										// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
										angle: 0,
										angleRandom: 360,
										startColour: [255, 255, 255, 100],
										startColourRandom: [0, 0, 0, 0],
										endColour: [255, 95, 0, 0],
										endColourRandom: [10, 5, 0, 0],
										// Only applies when fastMode is off, specifies how sharp the gradients are drawn
										sharpness: 50,
										sharpnessRandom: 10,
										// Random spread from origin
										spread: Math.random() * 20,
										// How many frames should this last
										duration: Math.random() * 10,
										// Will draw squares instead of circle gradients
										fastMode: false,
										gravity: { x: 0, y: 0 },
										// sensible values are 0-3
										jitter: 1,
										// Offset for the origin of the particles
										originOffset: { x: 0, y: 0 }
									}
								};

								//rdzeń wybuchu:
								var optionsWrogCore = {
									maxParticles: 200 * DD_mnożnikPartykle,
									size: 2,
									sizeRandom: 5,
									speed: 1,
									speedRandom: 3,
									direction: 50,
									// Lifespan in frames
									lifeSpan: 10,
									lifeSpanRandom: 1,
									// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
									angle: 0,
									angleRandom: 360,
									startColour: [255, 255, 255, 100],
									startColourRandom: [0, 0, 0, 0],
									endColour: [255, 255, 255, 0],
									endColourRandom: [10, 5, 0, 0],
									// Only applies when fastMode is off, specifies how sharp the gradients are drawn
									sharpness: 0,
									sharpnessRandom: 100,
									// Random spread from origin
									spread: Math.random() * 5,
									// How many frames should this last
									duration: Math.random() * 20,
									// Will draw squares instead of circle gradients
									fastMode: false,
									gravity: { x: 0, y: 0 },
									// sensible values are 0-3
									jitter: 1,
									// Offset for the origin of the particles
									originOffset: { x: 0, y: 0 }
								}


								//dodanie partykli do sceny:

								//otoczka:
								var partykle_wrog = Crafty.e('2D, Canvas, Particles, Delay, Motion')
									.attr({ x: hitDatas[i].obj.x + 30, y: hitDatas[i].obj.y + 30, vy: hitDatas[i].obj.velocity().y, vx: hitDatas[i].obj.velocity().x })
									.particles(optionsWrogOtoczka)
									.delay(function () {
										this.destroy();
									}, 1000, 0)
									;

								//rdzeń:
								var partykle_wrog2 = Crafty.e('2D, Canvas, Particles, Delay, Motion')
									.attr({ x: hitDatas[i].obj.x + 30, y: hitDatas[i].obj.y + 30, vy: hitDatas[i].obj.velocity().y, vx: hitDatas[i].obj.velocity().x })
									.particles(optionsWrogCore)
									.delay(function () {
										this.destroy();
									}, 1000, 0)
									;

								/*
								//dodanie blysku przy zniszczeniu wroga:
								let blysk_wrog = Crafty.e("blysk_wrog, 2D, Canvas, sprite_explode, SpriteAnimation, Renderable")
									.origin('center')
									.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y, w: 60, h: 60, rotation: Math.random()*360 })
									.reel('explode', 400, 0, 0, 3)
									.animate('explode', -1)
									;
								blysk_wrog.alpha = 0.5;
								//opoznieni usuwania blysku wroga:
								Crafty.e("Delay").delay(function () {
									blysk_wrog.destroy();
								}, 400, 0);
								*/

								//sprawdzenie czy wrog byl bossem:
								if (hitDatas[i].obj.boss) {
									//dodanie bonusa do sceny w miejsce wroga zycie:
									//console.log("spawnuj bonus bossa");
									var bonus = Crafty.e("bonus, 2D, Canvas, Image, Collision, Renderable, Motion, Delay")
										.attr({ x: hitDatas[i].obj.x + 20, y: hitDatas[i].obj.y + 25, w: 20, h: 20 })
										.image("assets/obrazki/zycie.png", "no-repeat")
										.collision([0, 0, 0, 20, 20, 20, 20, 0])
										.origin('center')
										.bind('EnterFrame', function () {
											this.rotation += 5;
										})
										//zderzenie z graczem:
										.onHit('gracz', function (hitDatas) {
											for (var i = 0; i < hitDatas.length; i++) {
												//dodanie bonusa dla gracza:
												nadajBonus(this.typ);
												//zniszczenie bonusa:
												this.destroy();
											}
										})
										.delay(function () {
											if (this.visible) {
												this.visible = false;
											} else {
												this.visible = true;
											}
										}, 150, 5)
										.delay(function () {
											this.visible = true;
											//zderzenie z pociskiem gracza:
											this.onHit('pocisk_gracza', function (hitDatas) {
												for (var i = 0; i < hitDatas.length; i++) {
													//dodanie blysku pocisku do sceny przy zderzeniu:
													var blysk_pocisk = Crafty.e("blysk_pocisk, 2D, Canvas, Particles")
														.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y, w: 12, h: 12 })
														.particles(optionsBonusZycie)
														;

													this.destroy(); //zniszczenie bonusa
													hitDatas[i].obj.destroy(); //zniszczenie pocisku

													//dodatkowe efx dla partykli uderzenia:
													blysk_pocisk.origin("center");
													blysk_pocisk.rotation = (Math.random() * 360);
													blysk_pocisk.alpha = 0.7;

													//opoznienie usuwania blysku pocisku ze sceny:
													Crafty.e("Delay").delay(function () {
														blysk_pocisk.destroy();
													}, 1000, 0);
												}
											})


										}, 1000, 0)
										;
									bonus.velocity().y = 100; //nadanie predkosci bonusowi
									bonus.typ = 'zycie'; //nadanie typu bonusa
								} else { //spawnuj bonus z wroga rebull/zycie
									if (Math.random() < 0.2) {
										//console.log("spawnuj bonus wroga");
										if (Math.random() < 0.2) { //szansa na zycie/redbull
											//spawnuj zycie:
											var bonus = Crafty.e("bonus, 2D, Canvas, Image, Collision, Renderable, Motion, Delay")
												.attr({ x: hitDatas[i].obj.x + 20, y: hitDatas[i].obj.y + 25, w: 20, h: 20 })
												.image("assets/obrazki/zycie.png", "no-repeat")
												.collision([0, 0, 0, 20, 20, 20, 20, 0])
												.origin('center')
												.bind('EnterFrame', function () {
													this.rotation += 5;
												})
												//zderzenie z graczem:
												.onHit('gracz', function (hitDatas) {
													for (var i = 0; i < hitDatas.length; i++) {
														//dodanie bonusa dla gracza:
														nadajBonus(this.typ);
														//zniszczenie bonusa:
														this.destroy();
													}
												})
												.delay(function () {
													if (this.visible) {
														this.visible = false;
													} else {
														this.visible = true;
													}
												}, 150, 5)
												.delay(function () {
													this.visible = true;
													//zderzenie z pociskiem gracza:
													this.onHit('pocisk_gracza', function (hitDatas) {
														for (var i = 0; i < hitDatas.length; i++) {
															//dodanie blysku pocisku do sceny przy zderzeniu:
															var blysk_pocisk = Crafty.e("blysk_pocisk, 2D, Canvas, Particles")
																.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y, w: 12, h: 12 })
																.particles(optionsBonusZycie)
																;

															this.destroy(); //zniszczenie bonusa
															hitDatas[i].obj.destroy(); //zniszczenie pocisku

															//dodatkowe efx dla partykli uderzenia:
															blysk_pocisk.origin("center");
															blysk_pocisk.rotation = (Math.random() * 360);
															blysk_pocisk.alpha = 0.7;

															//opoznienie usuwania blysku pocisku ze sceny:
															Crafty.e("Delay").delay(function () {
																blysk_pocisk.destroy();
															}, 1000, 0);
														}
													})


												}, 1000, 0)
												;
											bonus.velocity().y = 100; //nadanie predkosci bonusowi
											bonus.typ = 'zycie'; //nadanie typu bonusa

										} else {
											//spawnuj redbull:
											var bonus = Crafty.e("bonus, 2D, Canvas, Image, Collision, Renderable, Motion, Delay")
												.attr({ x: hitDatas[i].obj.x + 20, y: hitDatas[i].obj.y + 25, w: 10, h: 29 })
												.image("assets/obrazki/rebull.png", "no-repeat")
												.collision([0, 0, 0, 29, 10, 29, 10, 0])
												.origin('center')
												.bind('EnterFrame', function () {
													this.rotation += 5;
												})
												//zderzenie z graczem:
												.onHit('gracz', function (hitDatas) {
													for (var i = 0; i < hitDatas.length; i++) {
														//dodanie bonusa dla gracza:
														nadajBonus(this.typ);
														//zniszczenie bonusa:
														this.destroy();
													}
												})
												.delay(function () {
													if (this.visible) {
														this.visible = false;
													} else {
														this.visible = true;
													}
												}, 150, 5)
												.delay(function () {
													this.visible = true;
													//zderzenie z pociskiem gracza:
													this.onHit('pocisk_gracza', function (hitDatas) {
														for (var i = 0; i < hitDatas.length; i++) {
															//dodanie blysku pocisku do sceny przy zderzeniu:
															let blysk_pocisk = Crafty.e("blysk_pocisk, 2D, Canvas, Particles")
																.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y, w: 12, h: 12 })
																.particles(optionsBonusRebull)
																;

															this.destroy(); //zniszczenie bonusa
															hitDatas[i].obj.destroy(); //zniszczenie pocisku

															//dodatkowe efx dla partykli uderzenia:
															blysk_pocisk.origin("center");
															blysk_pocisk.rotation = (Math.random() * 360);
															blysk_pocisk.alpha = 0.7;

															//opoznienie usuwania blysku pocisku ze sceny:
															Crafty.e("Delay").delay(function () {
																blysk_pocisk.destroy();
															}, 1000, 0);
														}
													})


												}, 1000, 0)
												;
											bonus.velocity().y = 100; //nadanie predkosci bonusowi
											bonus.typ = 'rebull'; //nadanie typu bonusa

										}

									}
								}
								//zniszczenie wroga:
								hitDatas[i].obj.destroy();

								//dodanie punktów za zniszcznie worga;
								dodajPunkty(hitDatas[i].obj.punktyZaWroga * DD_fala);

								//wyswietlenie zdobytych punktów:
								var pokazPunkty = Crafty.e('2D, Canvas, Text, Delay, Motion, Renderable')
									.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y, z: 98 })
									.text('+' + hitDatas[i].obj.punktyZaWroga * DD_fala)
									.textColor('green')
									.textFont({ size: '15px', weight: 'normal' })
									.bind("EnterFrame", function (e) {
										this.alpha -= 0.01;
									})
									.delay(function () {
										this.destroy();
									}, 1500, 0)
									;
								pokazPunkty.velocity().y = -50;

								//dodanie obrazy prezesa po zniszczeniu wroga:
								DD_obrazy++;
								zmienObrazyPrezesa(DD_obrazy);

							};

							//dodanie blysku pocisku do sceny przy zderzeniu:
							let blysk_pocisk = Crafty.e("blysk_pocisk, 2D, Canvas, Image")
								.attr({ x: this.x, y: this.y, w: 12, h: 12 })
								.image("assets/obrazki/hit.gif", "no-repeat")
								;
							this.destroy();

							//dodatkowe efx dla partykli uderzenia:
							blysk_pocisk.origin("center");
							blysk_pocisk.rotation = (Math.random() * 360);
							blysk_pocisk.alpha = 0.7;

							//opoznienie usuwania blysku pocisku ze sceny:
							Crafty.e("Delay").delay(function () {
								blysk_pocisk.destroy();
							}, 100, 0);
						}
					})
					// zderzenie pocisków wroga i gracza:
					.onHit('pocisk_wroga', function (hitDatas) {
						for (var i = 0; i < hitDatas.length; i++) {

							//patykle :
							var optionsPociskOtoczka = {
								maxParticles: 70 * DD_mnożnikPartykle,
								size: 5,
								sizeRandom: 1,
								speed: 3,
								speedRandom: 3,
								direction: 0,
								// Lifespan in frames
								lifeSpan: 3,
								lifeSpanRandom: 10,
								// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
								angle: 0,
								angleRandom: 360,
								startColour: [255, 255, 255, 100],
								startColourRandom: [0, 0, 0, 0],
								endColour: [45, 120, 255, 0],
								endColourRandom: [10, 5, 0, 0],
								// Only applies when fastMode is off, specifies how sharp the gradients are drawn
								sharpness: 100,
								sharpnessRandom: 10,
								// Random spread from origin
								spread: Math.random() * 5,
								// How many frames should this last
								duration: Math.random() * 10,
								// Will draw squares instead of circle gradients
								fastMode: false,
								gravity: { x: 0, y: 0.5 },
								// sensible values are 0-3
								jitter: 1,
								// Offset for the origin of the particles
								originOffset: { x: 0, y: 0 }
							}

							//dodanie partykli przy zderzeniu:
							var partykle_pocisk = Crafty.e('2D, Canvas, Particles, Delay')
								.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y })
								.particles(optionsPociskOtoczka)
								.delay(function () {
									this.destroy();
								}, 1000, 0)
								;

							//dodanie efektu zderzenia:
							/*
							let blysk_pocisk = Crafty.e("blysk_pocisk, 2D, Canvas, Image")
								.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y, w: 12, h: 12 })
								.image("assets/obrazki/hit.gif", "no-repeat")
								;
							

							//dodatkowe efx dla partykli uderzenia:
							blysk_pocisk.origin("center");
							blysk_pocisk.rotation = (Math.random() * 360);
							blysk_pocisk.alpha = 0.7;

							
							//opoznienie usuwania blysku pocisku ze sceny:
							Crafty.e("Delay").delay(function () {
								blysk_pocisk.destroy();
							}, 100, 0);
							*/

							//dodanie informacji o zwiekszonej mocy obrazen zadawanych przez gracza:

							if (hitDatas[i].obj.czerwony){
								var obrazeniaZwieksz = 0.02;
							}else{
								var obrazeniaZwieksz = 0.01;
							}

							let wiekszeObrazenia = Crafty.e("wikeszeObrazenia, 2D, Canvas, Text, Renderable, Motion, Delay")
								.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y, z: 98 })
								.text('+' + Math.round((obrazeniaZwieksz) * 100) + '% mocy')
								.textColor('green')
								.textFont({ size: '15px', weight: 'normal' })
								.bind("EnterFrame", function (e) {
									this.alpha -= 0.01;
								})
								.delay(function () {
									this.destroy();
								}, 1500, 0)
								;

							wiekszeObrazenia.velocity().y = -50;

							DD_obrazeniaPocikskowGracz *= 1+obrazeniaZwieksz; //zwieksz obrazenia zadawane przez gracza;

							hitDatas[i].obj.destroy(); //usun pocisk wroga;
							this.destroy(); //usun pocisk gracza;
						}
					})
					.bind("EnterFrame", function (e) {
						//usuwanie pocisku po opuszczeniu sceny:
						if (this.y < -5) {
							this.destroy();
							//console.log("pocisk destroyed");
						}
						else {
							//zminana szerokosci w czasie:
							this.velocity().x = this.velocity().x / 1.05;
							this.w -= 0.09;
							this.x += 0.045;
							this.collision([0, 0, 0, 10, this.w, 10, this.w, 0])
							//zmiana koloru w czasie:
							this.kanal_zielony += 4;
							this.color(255, this.kanal_zielony, 0);
							//rotacja:
							this.rotation -= Math.atan(this.velocity().x / this.velocity().y) * 180 / Math.PI;
							//zmiana przezroczystości w czasie:
							//this.alpha -= 0.005;
						}
					});
				pocisk_gracza.velocity().y = -166; //ustalenie predkosci pocisku (pix/s)
				pocisk_gracza.velocity().x = gracz.velocity().x;
				pocisk_gracza.kanal_zielony = 0; //dodanie buforownia kanalu zielonego dla pojedynczego pocisku
				DD_wystrzelonePociski++; //zliczanie wystrzelonych pocisków

				zmienWystrzelonePociski(); //wyświelt liczbę wystrzelonych pocisków
			}

			//-----------------------------
			// WROGOWIE
			//-----------------------------
			//fala wrogow rekurencyjna:
			function spawnuj_fale(sekwnecje, dilaj, zasiegY, dilajMiedzyFalami) {
				var i = 0;
				//wywolanie opoznienia spawnu sekwencji:
				Crafty.e("Delay").delay(function () {
					spawnuj_sekwencje(i + 1, dilaj, zasiegY, sekwnecje);
					i++;
					//sprawdzenie czy sekwencja sie wyczerpala:
					if (i % sekwnecje == 0) {
						//rekurencyjne wywoalnie spwnowania fali od nowa:
						spawnuj_fale(sekwnecje, dilaj, zasiegY, dilajMiedzyFalami);
						//opoznione wywolanie zwiekszenia licznika fali:
						Crafty.e("Delay").delay(function () {
							DD_fala++;
						}, dilaj, 0);
					}
				}, dilaj + dilajMiedzyFalami, sekwnecje - 1);
			}

			//sekwencja wrogow:
			function spawnuj_sekwencje(numer, dilaj, zasiegY, sekwencje) {

				//inicjalizacja tablicy grafik dla wrogów:
				var grafika_wroga = new Array();
				//console.log(grafika_wroga);
				//sprawdzenie czy fala z bossem czy bez:
				if (numer == sekwencje) {
					numer += 1;
					for (var x = 0; x < numer; x++) {
						//ustalenie grafiki dla minionów:
						if (x < numer - 1) {
							if (Math.random() > 0.66) {
								grafika_wroga.push("assets/obrazki/wrog.png");
							} else if (Math.random() > 0.33) {
								grafika_wroga.push("assets/obrazki/wrog.png");
							} else {
								grafika_wroga.push("assets/obrazki/wrog.png");
							}
						} else {
							//wybów grafiki bossa zależnie od numeru fali:
							switch (true) {
								case DD_fala < 5:
									grafika_wroga.push("assets/obrazki/boss" + DD_fala + ".png");
									break;
								default:
									grafika_wroga.push("assets/obrazki/boss5.png");
									break;
							}
						}
					}
				} else {
					for (var x = 0; x < numer; x++) {
						if (Math.random() > 0.66) {
							grafika_wroga.push("assets/obrazki/wrog.png");
						} else if (Math.random() > 0.33) {
							grafika_wroga.push("assets/obrazki/wrog.png");
						} else {
							grafika_wroga.push("assets/obrazki/wrog.png");
						}
					}
				};

				//iteracja przez sekwencje fali:	
				for (var x = 0; x < numer; x++) {

					//dodanie wroga do sceny:
					let wrog = Crafty.e("wrog, 2D, Canvas, Image, Collision, Motion, Delay")
						.collision([0, 0, 0, 60, 60, 60, 60, 0])
						.attr({ x: (Math.random() * 450), y: -80, w: 60, h: 60 })
						.image(grafika_wroga[x], "no-repeat")
						.origin('center')//orenitacja obrotu;
						//obracanie wrogow:
						.bind("EnterFrame", function (e) {
							this.rotation += this.velocity().x / 100;
						})
						//strzał wroga:
						.delay(function () {
							//console.log("strzał wroga");
							//losowanie predkosci pocisku:
							var predkoscPociskuWroga = Math.floor((Math.random() * 170) + 140);
							//dodanie pocisku wroga do sceny:
							var pocisk_wroga = Crafty.e("pocisk_wroga, 2D, Canvas, Color, Collision, Renderable, Motion")
								.attr({ x: wrog.x + 21, y: wrog.y + 60, w: 8, h: 10 })
								.origin('center')
								.collision([0, 0, 0, 10, 8, 10, 8, 0])
								.bind("EnterFrame", function (e) {
									//usuwanie pocisku wroga po opuszczeniu sceny:
									if (this.y > 300) {
										this.destroy();
										//console.log("pocisk wroga destroyed");
									}
									else {
										//zminana szerokosci w czasie:
										this.w -= 0.05;
										this.x += 0.025;
										this.collision([0, 0, 0, 10, this.w, 10, this.w, 0])
										//zmiana koloru w czasie:
										this.kanal_zielony -= 1;
										this.color(this.kanal_czerowny, this.kanal_zielony, this.kanal_niebieski);
										//zmiana przezroczystości w czasie:
										this.alpha -= 0.01;
									}
								})
								.one("EnterFrame", function (e) {

									//nadanie predkosci dla pocisku wroga:			
									this.velocity().y = predkoscPociskuWroga;

									//losowe namierzanie gracza:
									if (Math.random() < DD_fala / 10 || wrog.boss) {

										this.czerwony = true;

										this.velocity().x = (Math.round(gracz.x) + 25 - Math.round(this.x) / (Math.abs(Math.round(gracz.y) - Math.round(this.y) + 150) / Math.round(pocisk_wroga.velocity().y)))/2;
										this.rotation -= Math.atan(this.velocity().x / this.velocity().y) * 180 / Math.PI;

										if (this.rotation >= 10 || this.rotation <= -10 || wrog.boss) {
											//dodanie kanałów RGB dla pocisku gracza:
											this.kanal_czerowny = 255;
											this.kanal_zielony = 0;
											this.kanal_niebieski = 0;
										} else {
											//dodanie kanałów RGB dla pocisku gracza:
											this.kanal_czerowny = 0;
											this.kanal_zielony = 200;
											this.kanal_niebieski = 255;
										}
									} else {
										//dodanie kanałów RGB dla pocisku gracza:
										this.kanal_czerowny = 0;
										this.kanal_zielony = 200;
										this.kanal_niebieski = 255;
									}

									//nadanie indeksu obrazen dla pocisku wroga:
									this.mocObrazen = 1 + DD_fala;
								})
								.onHit('gracz', function (hitDatas) {
									//console.log("gracz trafiony!");
									for (var i = 0; i < hitDatas.length; i++) {

										//kontrola zycia gracza:
										hitDatas[i].obj.zycie -= 1 * DD_fala;

										zmienZycieGracza(hitDatas[i].obj.zycie, '-');
										graczOberwal();

										//dodanie blysku przy zniszczeniu gracza:
										if (hitDatas[i].obj.zycie <= 0) {

											let blysk_gracz = Crafty.e("blysk_wrog, 2D, Canvas, sprite_explode, SpriteAnimation, Renderable")
												.attr({ x: hitDatas[i].obj.x, y: hitDatas[i].obj.y, w: 60, h: 60 })
												.reel('explode', 400, 0, 0, 3)
												.animate('explode', -1)
												;
											blysk_gracz.alpha = 0.8;
											//opoznieni usuwania blysku wroga:
											Crafty.e("Delay").delay(function () {
												blysk_gracz.destroy();
											}, 400, 0);

											//zniszczenie gracza:
											hitDatas[i].obj.destroy();
											gameOver();
										}
										this.destroy();

									}

									//dodanie blysku pocisku do sceny przy zderzeniu:
									let blysk_pocisk = Crafty.e("blysk_pocisk, 2D, Canvas, Image")
										.attr({ x: this.x, y: this.y, w: 12, h: 12 })
										.image("assets/obrazki/hit.gif", "no-repeat")
										;
									this.destroy();

									//dodatkowe efx dla partykli uderzenia:
									blysk_pocisk.origin("center");
									blysk_pocisk.rotation = (Math.random() * 360);
									blysk_pocisk.alpha = 0.7;

									//opoznienie usuwania blysku pocisku ze sceny:
									Crafty.e("Delay").delay(function () {
										blysk_pocisk.destroy();
									}, 100, 0);

								})
								;

						}, (Math.random() * (1 - 0.1) + 0.1) * 4000, 10)
						;

					//zdefiniowanie zycia dla wroga:
					wrog.zycie = 5 + DD_fala;

					//losowanie ruchow:
					let random_y = (Math.random() * (0.9 - 0.3)) + 0.3;
					let kierunek_x = Math.random();
					let predkosc_x_1 = Math.random();
					let predkosc_x_2 = Math.random();
					//losowanie czasów strzału:
					let random_strzal = 0;

					//ustawienie predkosci Y:
					wrog.velocity().y = zasiegY / (dilaj * random_y) * 1000;
					Crafty.e("Delay").delay(function () {
						wrog.velocity().y = -zasiegY / (dilaj * (1 - random_y)) * 1000;
					}, dilaj * random_y, 0);


					//ustawienie predkosci X:
					if (kierunek_x < 0.5) {
						//w prawo:
						wrog.velocity().x = ((560 - wrog.x) / (dilaj * random_y) * 1000) * predkosc_x_1;
						Crafty.e("Delay").delay(function () {
							wrog.velocity().x = ((wrog.x) / (dilaj * (1 - random_y)) * 1000) * predkosc_x_2 * -1;
						}, dilaj * random_y, 0);
					}
					//w lewo:
					else {
						wrog.velocity().x = ((wrog.x) / (dilaj * random_y) * 1000) * predkosc_x_2 * -1;
						Crafty.e("Delay").delay(function () {
							wrog.velocity().x = ((560 - wrog.x) / (dilaj * (1 - random_y)) * 1000) * predkosc_x_1;
						}, dilaj * random_y, 0);
					}
					//opóżnienie autodestrukcji wroga po powrocie za górny margines:
					Crafty.e("Delay").delay(function () {
						wrog.destroy();
					}, dilaj, 0);

					//oznaczenie punktacji zaleznie od typu wroga:
					if (x == sekwencje) {
						//boss:
						wrog.punktyZaWroga = 500;
						wrog.boss = true;
					} else {
						//minion:
						wrog.punktyZaWroga = 50;
					}
				}
			}

			//rozpoczecie petli fal wrogow:
			spawnuj_fale(4, 9000, 240, 1000);

			//------------------//
			//funkcje pomocnicze:
			//------------------//

			//wyświetlanie zycia:
			function zmienZycieGracza(zycie, typ) {

				//zerowanie zycia jezeli ujemne:
				switch (true) {
					case zycie < 0:
						zycie = 0;
						break;
				}

				document.getElementById('zycie').innerHTML = "ŻYCIE : " + zycie;

				//chwilowa stylizacja licznika zycia po zmianie:
				var zycieDOM = document.getElementById("zycie");
				switch (typ) {
					case '-':
						//--odjecie--kolorowanie na czerowno wyswietlacza zycia:
						zycieDOM.style.color = "red";
						Crafty.e('Delay')
							.delay(function () {
								zycieDOM.style.color = "green";
							}, 150, 0);
						break;
					case '+':
						//--dodanie--pogrubianie wyswielania zycia:
						zycieDOM.style.fontWeight = "bold";
						Crafty.e('Delay')
							.delay(function () {
								zycieDOM.style.fontWeight = "normal";
							}, 300, 0);
				}
				return;
			}

			//wyświeltanie wystrzelonych pocisków:
			function zmienWystrzelonePociski() {
				document.getElementById('strzaly').innerHTML = "Wystrzeliłeś " + DD_wystrzelonePociski + " pocisków";
				return;
			}

			//wyświetlanie obrazy prezesa:
			function zmienObrazyPrezesa(obrazyPrezesa) {

				// ustalenie końcówki dla napisu:
				var napis = new String();
				switch (obrazyPrezesa) {
					case 1:
						napis = " raz";
						break;
					default:
						napis = " razy";
				}

				document.getElementById('wrogowie').innerHTML = "Obraziłeś Prezesa " + obrazyPrezesa + napis;
				return;
			}

			//wyświetlanie punktów:
			function dodajPunkty(punkty) {
				DD_score += punkty;
				document.getElementById('punkty').innerHTML = "Score : " + DD_score;
				return;
			}

			//game over:
			function gameOver() {
				//console.log("game over");

				//dodanie napisu GAMER OVER
				var gameOverNapis = Crafty.e('2D, Canvas, Text')
					.attr({ x: 250, y: 130, z: 99 })
					.text('GAME OVER!')
					.textColor('red')
					.textFont({ size: '40px', weight: 'bold' })
					.textAlign('center')
					;

				//przeldowanie strony + popup z zachowaniem wynikow (poki co placeholder)
				setTimeout(function () { window.location.reload(); }, 5000);
				//setTimeout(function () { confirm("Your Score is " + DD_score + "\nDo You want ro record this score?"); }, 4000);

				return;
			}

			//akcje przy oberwaniu pociskiem od wroga
			function graczOberwal() {

				//zabieranie rebulla:
				if (DD_predkoscPocztkowaGracza >= 250) {
					DD_predkoscPocztkowaGracza -= 125;
					gracz.twoway(DD_predkoscPocztkowaGracza); //redukuj predkosc gracza
					DD_obrazeniaPocikskowGracz -= 0.05; //zredukuj obrazenia zadawane przez pociski gracza

					//dodaj napis o redukcji rebulla:
					var bonusTekst = Crafty.e("2D, Canvas, Text, Delay, Motion")
						.attr({ x: gracz.x - 25, y: gracz.y, z: 98 })
						.text('- REBULL')
						.textColor('gray')
						.textFont({ size: '15px', weight: 'bold' })
						.bind('EnterFrame', function (e) {
							this.alpha -= 0.01;
						})
						.delay(function () {
							this.destroy();
						}, 1500, 0)
						;
					bonusTekst.velocity().y = -50;

				}
				if (DD_buforStrzalu <= 5) {
					DD_buforStrzalu += 1; //redukuj szybkosztrzelnosc
				}

				//czerwona maska przy oberwaniu od przeciwnika:
				var boli = Crafty.e('2D, Canvas, Image, Renderable, Delay')
					.attr({ x: 0, y: 0, w: 500, h: 300 })
					.image("assets/obrazki/ouch2.png", "no-repeat")
					.delay(function () {
						this.destroy();
					}, 150, 0)
					;
				// intensywnosc maski zalezy od ilosci pozostalego zycia:
				boli.alpha = (1 / gracz.zycie) * DD_fala;
				return;
			}

			//nadawanie zebranego bonusa:
			function nadajBonus(typBonusa) {
				if (typeof typBonusa == undefined) {
					console.log("undefined w typie bonusa!");
				}
				switch (typBonusa) {
					//typ zycie:
					case 'zycie':
						//nadanie bonusa:
						gracz.zycie += 1 * DD_fala;
						zmienZycieGracza(gracz.zycie, '+');
						//wyswietlenia tekstu na polu gry:
						var bonusTekst = Crafty.e("2D, Canvas, Text, Delay, Motion")
							.attr({ x: gracz.x - 25, y: gracz.y, z: 98 })
							.text('+' + 1 * DD_fala + ' życia')
							.textColor('green')
							.textFont({ size: '15px', weight: 'bold' })
							.bind('EnterFrame', function (e) {
								this.alpha -= 0.01;
							})
							.delay(function () {
								this.destroy();
							}, 1500, 0)
							;
						bonusTekst.velocity().y = -50;
						break;
					//typ redbull:	
					case 'rebull':
						if (DD_predkoscPocztkowaGracza <= 1500) { //ogranicznik predkosci ;)
							DD_predkoscPocztkowaGracza += 125
						}
						gracz.twoway(DD_predkoscPocztkowaGracza); //zwikszenie predkosci gracza
						//zwiekszenie szybkostrzelnosci:
						if (DD_buforStrzalu >= 1) {
							DD_buforStrzalu -= 1;
						}

						DD_obrazeniaPocikskowGracz += 0.05 //zwieksz obrazenia zadawane przez pociski gracza

						var bonusTekst = Crafty.e("2D, Canvas, Text, Delay, Motion")
							.attr({ x: gracz.x - 25, y: gracz.y, z: 98 })
							.text('+REBULL!')
							.textColor('red')
							.textFont({ size: '15px', weight: 'bold' })
							.bind('EnterFrame', function (e) {
								this.alpha -= 0.01;
							})
							.delay(function () {
								this.destroy();
							}, 1500, 0)
							;
						bonusTekst.velocity().y = -50;
				}
			}


		}
	}


}
