import { _decorator, bezier, Camera, CCFloat, clamp, Collider, Component, EventMouse, geometry, Input, input, inverseLerp, Label, Node, PhysicsSystem, Quat, random, randomRange, Slider, Sprite, tween, Tween, UITransform, Vec2, Vec3, Widget } from 'cc';
import { PowerSlide, SlideConfig } from './PowerSlide';
import { TargetBoard } from './TargetBoard';
import { PredefinedGuns } from './Data';
import { Target } from './Target';
const { ccclass, property } = _decorator;

@ccclass('ShootEffect')
export class ShootEffect extends Component
{
	@property(Node)
	private rotationNode: Node;
	@property(Node)
	private spriteNode: Node;
	@property(Label)
	private scoreText: Label;
	@property({type:CCFloat})
	private minRotation: number;
	@property({type:CCFloat})
	private maxRotation: number;
	@property({type:Vec2})
	private minShift: Vec2;
	@property({type:Vec2})
	private maxShift: Vec2;
	@property({type:CCFloat})
	private pulseCycle: number;
	@property({type:CCFloat})
	private effectTime: number;

	private _pulseTween: Tween<Node> = null;

	protected start(): void
	{
		this.randomizeAppearance();

		var t1 = tween(this.node).to(this.pulseCycle, { scale: new Vec3(1.2, 1.2, 1) }, {
			easing: "cubicInOut",
		});
		var t2 = tween(this.node).to(this.pulseCycle, { scale: new Vec3(1, 1, 1) }, {
			easing: "cubicInOut",
		});

		tween(this.node).sequence(t1, t2).repeatForever().start();
		setTimeout(() => this.node.destroy(), this.effectTime * 1000);
	}

	public setScore(score: number)
	{
		this.scoreText.string = "+" + score.toString();
	}

	protected randomizeAppearance()
	{
		this.rotationNode.rotation = Quat.fromEuler(new Quat(), 0, 0, randomRange(this.minRotation, this.maxRotation));
		this.spriteNode.position = this.spriteNode.position.add(new Vec3(randomRange(this.minShift.x, this.maxShift.x), randomRange(this.minShift.y, this.maxShift.y), 0));
	}
}