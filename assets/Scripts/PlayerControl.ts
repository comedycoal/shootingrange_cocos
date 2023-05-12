import { _decorator, Camera, Canvas, CCFloat, clamp, Collider, Component, EventMouse, Game, game, geometry, Input, input, instantiate, inverseLerp, Node, PhysicsSystem, Prefab, Slider, Sprite, tween, Tween, UITransform, Vec3, Widget } from 'cc';
import { PowerSlide, SlideConfig } from './PowerSlide';
import { TargetBoard } from './TargetBoard';
import { PredefinedGuns } from './Data';
import { Target } from './Target';
import { ReloadingSprite } from './ReloadingSprite';
import { MissedEffect } from './MissedEffect';
import { ShootEffect } from './ShootEffect';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

export class GunConfig
{
	name: string;
	reticles: number; 		// a mask 0b000111000
	reloadTime: number;
	sliderConfig: SlideConfig;
}

export const TargetMask = 1 << 1;
export const BoardSnapMask = 1 << 2;

@ccclass('PlayerControl')
export class PlayerControl extends Component
{
	@property(Camera)
	private camera: Camera;
	@property(Canvas)
	private canvas: Canvas;
	@property(Node)
	private reticleHost: Node;
	@property([Node])
	private reticles: Node[] = [];
	@property(TargetBoard)
	private board: TargetBoard;
	@property(PowerSlide)
	private powerSlide: PowerSlide;
	@property(ReloadingSprite)
	private reloadImage: ReloadingSprite;
	@property(Prefab)
	private hitEffectPrefab: Prefab;
	@property(Node)
	private backgroundEffectHost: Node;
	@property(Prefab)
	private missEffectPrefab: Prefab;
	@property(Node)
	private gameManager: Node;
		
	private _gunConfig: GunConfig;
	private _recticleGrid: Node[][] = [];

	private _allowControl: boolean = false;
	private _aimLocked: boolean = false;
	private _reloading: boolean = false;
	private _reloadTimer: number = 0;
	private _reloadCallback: Function;

	protected start(): void
	{
		this._recticleGrid = [];
		for (let i = 0; i < 3; ++i)
		{
			this._recticleGrid.push([]);
			for (let j = 0; j < 3; ++j)
			{
				this._recticleGrid[i].push(this.reticles[i * 3 + j]);
			}

		}

		input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);

		this._reloadCallback = this.startReloading;
	}

	protected update(dt: number): void
	{
		if (this._reloading)
		{
			this._reloadTimer -= dt;

			if (this._reloadTimer <= 0)
			{
				this.stopReloading();
			}
		}
	}

	public setGun(config: GunConfig)
	{
		this._gunConfig = config;
		this.refreshConfig();
	}

	public allowGunControl()
	{
		this._reloading = false;
		this._aimLocked = false;
		this.reticleHost.active = false;
		this._allowControl = true;
	}

	public disableGunControl()
	{
		if (this._reloadCallback != null)
		{
			this.unschedule(this._reloadCallback);
		};

		this.reloadImage.hide();
		this._aimLocked = false;
		this.reticleHost.active = false;
		this.powerSlide.stopSlide();
		this._allowControl = false;
	}

	private onMouseDown(event: EventMouse)
	{
		if (this._allowControl)
		{
			if (event.getButton() === EventMouse.BUTTON_LEFT)
			{
				if (!this._reloading && !this._aimLocked)
				{
					this.aim(event.getUILocationX(), event.getUILocationY());
				}
				else if (!this._reloading)
				{
					this.shoot();
				}
				else
				{
					
				}
			}
		}
	}

	private aim(x: number, y: number)
	{
		const maxDistance = 10000000;
		const queryTrigger = true;

		// Snap gun
		let ray = new geometry.Ray(x, y, this.node.worldPosition.z, 0, 0, -1);
		
		if (PhysicsSystem.instance.raycastClosest(ray, BoardSnapMask, maxDistance, queryTrigger))
		{
			const result = PhysicsSystem.instance.raycastClosestResult;
			this.node.setWorldPosition(new Vec3(result.collider.node.worldPosition.x, result.collider.node.worldPosition.y, this.node.worldPosition.z));

			this.reticleHost.active = true;
			this.powerSlide.startSlide();
			this._aimLocked = true;
		}
		else
		{
			// Aim fail, return
			return;
		}
	}

	private shoot()
	{
		const maxDistance = 10000000;
		const queryTrigger = true;

		this.powerSlide.stopSlide();

		let hit = this.powerSlide.getHitResult();
		let targetCount = 0;
		for (let i = 0; i < this.reticles.length; ++i)
		{
			if ((1 << i) & this._gunConfig.reticles)
			{
				targetCount++;
				let node = this.reticles[i];
				if (hit)
				{
					let ray = new geometry.Ray(node.worldPosition.x, node.worldPosition.y, node.worldPosition.z, 0, 0, -1);
					let targetDown = PhysicsSystem.instance.raycastClosest(ray, TargetMask, maxDistance, queryTrigger)
					const result = PhysicsSystem.instance.raycastClosestResult;
					if (targetDown)
					{
						let hitTop = result.collider.node.name === "TopCollider";
						// console.log(result.collider.node.name + " -> " + result.collider.node.parent.name);
						result.collider.node.parent.getComponent(Target).onBoardShot(hitTop);

						let node = instantiate(this.hitEffectPrefab);
						node.parent = this.canvas.node;
						node.setWorldPosition(result.collider.node.worldPosition);
						let score = result.collider.node.parent.getComponent(Target).scoreForHit;
						node.getComponent(ShootEffect).setScore(score);
						this.gameManager.getComponent(GameManager).addScore(score)
					}
					else
					{
						let effect = instantiate(this.missEffectPrefab);
						effect.setParent(this.backgroundEffectHost);
						effect.worldPosition = result.collider.node.worldPosition;
						effect.getComponent(MissedEffect).startEffect(1);
					}
				}
			}
		}

		if (hit)
		{
			this.board.evaluateWaveCompletion();
		}
		else
		{
			let effect = instantiate(this.missEffectPrefab);
			effect.setParent(this.backgroundEffectHost);
			effect.worldPosition = this.node.worldPosition;
			effect.getComponent(MissedEffect).startEffect(targetCount);
		}

		this.reticleHost.active = false;
		this.startReloading();
	}

	private startReloading()
	{
		this._reloading = true;
		this.reloadImage.show();
		this._reloadTimer = this._gunConfig.reloadTime;
	}

	private stopReloading()
	{
		this._reloading = false;
		this.reloadImage.hide();

		this._aimLocked = false;
	}

	private refreshConfig()
	{
		let mask = this._gunConfig.reticles;
		for (let i = 0; i < this.reticles.length; ++i)
		{
			if ((1 << i) & mask)
			{
				this.reticles[i].active = true;
			}
			else
			{
				this.reticles[i].active = false;
			}
		}
		
		this.powerSlide.setConfig(this._gunConfig.sliderConfig);
	}
}

