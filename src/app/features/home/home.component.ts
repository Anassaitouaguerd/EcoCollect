import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { NewRequestModalComponent } from './components/new-request-modal/new-request-modal.component';
import { selectAllRequests } from './store/request.selectors';
import { Request } from '../../interfaces/request.interface';
import { loadRequests } from './store/request.actions';
import { UpdateRequestModalComponent } from './components/update-request-modal/update-request-modal.component';
import { DeleteRequestModaleComponent } from './components/delete-request-modale/delete-request-modale.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrameId: number = 0;
  private isBrowser: boolean;
  allRequests$: Observable<Request[]>;
  public countRequestPanding: number = 0;
  public pointsUser: number = 0 ;

  constructor(
    private router: Router,
    private store: Store,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(NgbModal) private modalService: NgbModal
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.allRequests$ = this.store.select(selectAllRequests);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initParticles();
      this.animate(); 
    }
  }

  ngOnInit() {
    this.store.dispatch(loadRequests());
    if(this.allRequests$){
      this.allRequests$.subscribe(requests => {
        requests.forEach(request => {
          if(request.status == 'pending' && request.user_email == this.getUserEmail()){
      
            this.countRequestPanding = this.countRequestPanding + 1 ;          
     
          }
        });
      });
    }
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.pointsUser = JSON.parse(currentUser).points;
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initParticles() {
    const canvas = this.particleCanvas.nativeElement;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) return;
    
    this.particles = Array(100).fill(null).map(() => new Particle(canvas.width, canvas.height));
  }

  private animate() {
    if (!this.ctx || !this.particleCanvas) return;
    
    this.ctx.clearRect(0, 0, this.particleCanvas.nativeElement.width, this.particleCanvas.nativeElement.height);
    this.particles.forEach(p => p.update(this.ctx!));
    this.animationFrameId = window.requestAnimationFrame(() => this.animate());
  }

  showNewRequestModal() {
    const modalRef = this.modalService.open(NewRequestModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    
    modalRef.result.then(
      (result) => {
        if (result) {
          
          console.log('New Request:', result);
        }
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason); // Add this line for debugging
      }
    );
  }
  
  showUpdateRequestModal(requestId: string ,requestStatus: string ) {
    const modalRef = this.modalService.open(UpdateRequestModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    
    modalRef.componentInstance.requestId = requestId;
    modalRef.componentInstance.requestStatus = requestStatus;
    
    modalRef.result.then(
      (result) => {
        if (result) {
          
          console.log('New Request:', result);
        }
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason);
      }
    );
  }

  showDeleteRequestModal(requestId: string ) {
    const modalRef = this.modalService.open(DeleteRequestModaleComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    
    modalRef.componentInstance.requestId = requestId;
    
    
    modalRef.result.then(
      (result) => {
        if (result) {
          
          console.log('New Request:', result);
        }
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason); // Add this line for debugging
      }
    );
  }

  logout() {
    localStorage.getItem('currentUser') ? localStorage.removeItem('currentUser') : "";
    this.router.navigate(['/login']);
  }

  getUserEmail(): string{
    return localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).email : '';
  }
  
  public convertPoints(option: 100 | 200 | 500): void {
    const conversionRates = {
      100: 50,
      200: 120,
      500: 350
    };
    if (this.pointsUser >= option) {
      console.log(`Converted ${option} points to ${conversionRates[option]}Dh voucher`);

      this.pointsUser = this.pointsUser - option;

      const currentUser = localStorage.getItem('currentUser');

      if (currentUser) {
        JSON.parse(currentUser).points = this.pointsUser;
      }

      alert(`Voucher de ${conversionRates[option]}Dh généré !`);
      
    } else {
      alert('Points insuffisants !');
    }
  }
}

class Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;

  constructor(private maxWidth: number, private maxHeight: number) {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.speed = 0;
    this.alpha = 0;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.maxWidth;
    this.y = Math.random() * this.maxHeight;
    this.radius = Math.random() * 2;
    this.speed = Math.random() * 0.5 + 0.2;
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  update(ctx: CanvasRenderingContext2D) {
    this.y -= this.speed;
    if (this.y < 0) this.reset();
    
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}