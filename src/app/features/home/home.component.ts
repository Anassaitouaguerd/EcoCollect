import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { NewRequestModalComponent } from './components/new-request-modal/new-request-modal.component';
import { selectAllRequests } from './store/request.selectors';
import { Request } from '../../interfaces/request.interface';

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

  logout() {
    this.router.navigate(['/login']);
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