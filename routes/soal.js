var express = require('express');
var router = express.Router();
var checkData = require('../validator/soal/create_update');
router.get('/',(req, res, next)=>{
	sql = 'call getSoal("0000000");';
	koneksi.query(sql, (e, r, f)=>{
		if(!e){
			var hasil = {
				status : true,
				data : r[0],
				error : null
				};
			}
		else {
			var hasil = {
				status : false,
				data : r[0],
				error : e
				};
			
			}
		res.json(hasil);
		});
	});
router.get('/:id',(req, res, next)=>{
	var id = req.params.id;
	sql = 'select * from tbsoal where id_soal="'+id+'"; select * from tbpilihan_ganda where id_pilihan_ganda="PG'+id+'"';
	koneksi.query(sql, (e, r, f)=>{
		if(!e){
				if(r[0].length == 0) {
					var hasil = {
						status : false,
						data : r[0],
						error : "Data tidak ditemukan!"
						};
					
				}
				else {
					r[0][0].pilihan_ganda = r[1];
					var hasil = {
						status : true,
						data : r[0],
						error : null
					};
				}
			}
		else {
			var hasil = {
				status : false,
				data : r[0],
				error : e
				};
				
			}
		res.json(hasil);
		});
	});
router.get('/not/:id',(req, res, next)=>{
	var id = req.params.id;
	sql = 'call getNotSoalUjian("'+id+'")';
	koneksi.query(sql, (e, r, f)=>{
		if(!e){
				if(r[0].length == 0) {
					var hasil = {
						status : false,
						data : r[0],
						error : "Data tidak ditemukan!"
						};
					
				}
				else {
					r[0][0].pilihan_ganda = r[1];
					var hasil = {
						status : true,
						data : r[0],
						error : null
					};
				}
			}
		else {
			var hasil = {
				status : false,
				data : r[0],
				error : e
				};
				
			}
		res.json(hasil);
		});
	});
router.post('/create',(req,res,next)=>{
	var data = req.body;
	var hasil = {};
	console.log(data);
	req.checkBody(checkData);
	req.getValidationResult().then(function(result){
	result.useFirstErrorOnly();
	var pesan = result.mapped();
	if(result.isEmpty() == false){
		if(pesan.isi_soal == undefined){
			pesan.isi_soal ={
				param : "isi_soal",
				msg : "",
				value : data.isi_soal
			};
		}
		if(pesan.jawaban == undefined){
			pesan.jawaban ={
				param : "jawaban",
				msg : "",
				value : data.jawaban
			};
		}
		hasil = {
			status : false,
			error : pesan
			};
	res.json(hasil); 
	}
	else{
	var sql1 = '';
	var pg = data.pilihan_ganda;
	for(var x=0;x<pg.length;x++){
		if(x == 0) sql1 = '(@id_pg,"'+pg[x].huruf+'","'+pg[x].isi_pilihan+'")';
		else sql1+= ',(@id_pg,"'+pg[x].huruf+'","'+pg[x].isi_pilihan+'")';
	}
	sql = 'set @id_pg=genIdSoal(); call createSoal("'+data.isi_soal+'","'+data.jawaban+'",@id_pg); insert into tbpilihan_ganda (id_pilihan_ganda,huruf,isi_pilihan) values '+sql1+';';
	koneksi.query(sql, function(e, r, f){
		if(!e){
			hasil = {
					status : true,
					error : null
				};
			}
		else {
			hasil = {
					status : false,
					error : e
				};
			
			}
		res.json(hasil);
		});
	}
	});
});
router.delete('/delete/:id',(req,res,next)=>{
	var id = req.params.id;
	var hasil = {};
	sql = 'call deleteSoal("'+id+'");';
	koneksi.query(sql, (e, r, f)=>{
		if(!e){
				if(r.affectedRows != 0){
					hasil = {
						status : true,
						error : null
						};
				}
				else {
					hasil = {
						status : false,
						error : "Data tidak ditemukan"
						};
					
					}
			}
		else {
			hasil = {
				status : false,
				error : e
				};
			
			}
		res.json(hasil);
		});
	});
router.put('/update/:id',(req,res,next)=>{
	var data = req.body;
	var id = req.params.id;
	var hasil = {};
	req.checkBody(checkData);
	req.getValidationResult().then(function(result){
	result.useFirstErrorOnly();
	var pesan = result.mapped();
	if(result.isEmpty() == false){
		if(pesan.isi_soal == undefined){
			pesan.isi_soal ={
				param : "isi_soal",
				msg : "",
				value : data.isi_soal
			};
		}
		if(pesan.jawaban == undefined){
			pesan.jawaban ={
				param : "jawaban",
				msg : "",
				value : data.jawaban
			};
		}
		hasil = {
			status : false,
			error : pesan
			}; 
	res.json(hasil);
	}
	else{
	var sql1 = '';
	var pg = data.pilihan_ganda;
	for(var x=0;x<pg.length;x++){
		if(x == 0) sql1 = '("PG'+id+'","'+pg[x].huruf+'","'+pg[x].isi_pilihan+'")';
		else sql1+= ',("PG'+id+'","'+pg[x].huruf+'","'+pg[x].isi_pilihan+'")';
	}
	sql = 'call updateSoal("'+id+'","'+data.isi_soal+'","'+data.jawaban+'"); insert into tbpilihan_ganda (id_pilihan_ganda,huruf,isi_pilihan) values '+sql1+';';
	koneksi.query(sql, function(e, r, f){
		if(!e){
			if(r.affectedRows != 0){
					hasil = {
						status : true,
						error : null
						};
				}
				else {
					hasil = {
						status : false,
						error : "ID Data tidak ditemukan"
						};
					
				}
			}
		else {
			hasil = {
					status : false,
					error : e
				};
			
			}
		res.json(hasil);
		});
	}
	});
});

module.exports = router;
