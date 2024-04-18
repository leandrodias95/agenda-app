import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { ContatoService } from '../contato.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; //formbuilder define os campos e o formgroup o formulário em si
import { MatDialog } from '@angular/material/dialog';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

formulario!: FormGroup;
contato!: Contato
contatos: Contato[] = []; 
colunas = ['foto', 'id', 'nome', 'email', 'favorito'];
totalElementos = 0; 
page = 0; 
pageSize = 10;
totalPaginas!: number;
pageSizeOptions: number[] = [10];


  constructor(
    private service: ContatoService,
    private fb: FormBuilder, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){

  }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContato(this.page, this.pageSize);
  }

listarContato(pagina: number, tamanho: number){
  this.service.list(pagina, tamanho).subscribe(response=>{
    this.contatos = response.content;
    this.totalElementos = response.totalElements;
    this.page = response.number;
    this.pageSize = response.size;
    this.totalPaginas = response.totalPages
  })
}

montarFormulario(){
  this.formulario= this.fb.group({ 
    nome: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]]
  })
}

favoritar(contato: Contato): void {
  contato.favorito = !contato.favorito;
  this.service.favorite(contato.id, contato.favorito).subscribe(
    response => {
      console.log('Status de favorito atualizado com sucesso!');
      // Você pode adicionar lógica adicional aqui, como exibir uma mensagem de sucesso
    },
    error => {
      console.error('Erro ao atualizar status de favorito:', error);
      // Trate o erro conforme necessário (exibindo mensagem de erro, etc.)
    }
  );
}


  submit(){
  const formValues = this.formulario.value;
  this.contato = new Contato(formValues.nome, formValues.email);
  this.contato.favorito= false;
  this.service.save(this.contato).subscribe(response =>{
  let lista: Contato[] = [...this.contatos, response] //...spred operator pega cada objeto que está dentro e adiciona no array
  this.contatos =lista;
  this.snackBar.open('Contato foi adicionado', 'Sucesso!', {
    duration: 2000})
   })
   this.formulario.reset();
  }

  getErrorEmail(){
    const errorEmail = this.formulario.get('email');
    if(errorEmail?.hasError('required') && !errorEmail.pristine){
      return 'e-mail obrigatório';
    }
    if(errorEmail?.hasError('email')){
      return 'e-mail inválido';
    }
    return;
  }

  getErrorNome(){
    const errorNome = this.formulario.get('nome');
    if(errorNome?.hasError('required') && !errorNome.pristine){
      return 'nome é obrigatório';
    }
    return;
  }

  uploadFoto(event: any, contato: Contato){
    const files = event.target.files;
    if(files){
      const foto =  files[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.service.upload(contato, formData).subscribe(response => { 
      this.listarContato(this.page, this.pageSize)
    });
    }
  }
  visualizarContato(contato: Contato){
    this.dialog.open(ContatoDetalheComponent, {
      width:'400px',
      height: '450px', 
      data: contato
    })
  }
paginar(event: PageEvent){
this.page= event.pageIndex;
this.listarContato(this.page, this.pageSize);
  }
}
