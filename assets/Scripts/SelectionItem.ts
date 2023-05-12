import { _decorator, bezier, Camera, CCFloat, CCString, clamp, Collider, Component, EventMouse, geometry, Input, input, instantiate, inverseLerp, lerp, Node, PhysicsSystem, Quat, random, randomRange, Slider, Sprite, tween, Tween, UITransform, Vec2, Vec3, Widget } from 'cc';
import { PowerSlide, SlideConfig } from './PowerSlide';
import { TargetBoard } from './TargetBoard';
import { PredefinedGuns } from './Data';
import { Target } from './Target';
import { GunConfig } from './PlayerControl';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('SelectionItem')
export class SelectionItem extends Component
{
	@property(GameManager)
	private gameManager: GameManager;
	@property({ type: CCString })
	private gunId: string;

	public getGun(): GunConfig
	{
		return PredefinedGuns[this.gunId];
	}

	public onSelected()
	{	
		this.gameManager.onConfirmWeapon(this);
	}
}