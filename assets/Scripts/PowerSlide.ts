import { _decorator, CCFloat, clamp, Component, Node, randomRange, Slider, tween, Tween, UITransform, Vec2, Vec3, Widget } from 'cc';
const { ccclass, property } = _decorator;

export class SlideConfig
{
    hitZoneLeft: number;        // 0 -> 1. 0 = no hit zone, 1 = all hit zone
    hitZoneRight: number;        // 0 -> 1. 0 = no hit zone, 1 = all hit zone
    sliderCycleTime: number;     // Time to move slider from 0 -> 1
}

@ccclass('PowerSlide')
export class PowerSlide extends Component
{
    @property(Slider)
    private slider: Slider;
    @property(Widget)
    private hitzone: Widget;
    @property({ type:CCFloat })
    private moveTime: number;
    @property({ type:CCFloat })
    private showY: number;
    @property({ type:CCFloat })
    private hideY: number;

    private _slideTween: Tween<Slider> = null;
    private _moveTween: Tween<Node> = null;
    private _slideConfig: SlideConfig = null;

    private _width: number;

    protected onLoad(): void
    {
        this._width = this.node.getComponent(UITransform).contentSize.width;
    }

    protected start(): void
    {
        
    }

    public startSlide()
    {
        if (this._slideTween != null)
        {
            this._slideTween.stop();
            this._slideTween = null;
        }

        if (this._slideConfig == null)
        {
            throw new Error("There is no _slideConfig");
        }

        this.slider.progress = 0;
        // this.slider.node.active = true;

        if (this._moveTween != null)
        {
            this._moveTween.stop();
        }
        this._moveTween = tween(this.slider.node).to(this.moveTime, { position: new Vec3(0, this.showY, 0) }, {
            easing: "linear",
            onComplete: (target) =>
            {
                this._moveTween = null;
            }
        }).start();

        this._slideTween = this.getSlideTween();
        this._slideTween.start();
    }

    public stopSlide()
    {
        if (this._slideTween != null)
        {
            this._slideTween.stop();
            this._slideTween = null;
        }

        if (this._moveTween != null)
        {
            this._moveTween.stop();
        }

        this._moveTween = tween(this.slider.node).to(this.moveTime, { position: new Vec3(0, this.hideY, 0) }, {
            easing: "linear",
            onComplete: (t) =>
            {
                // this.slider.node.active = false;
                this._moveTween = null;
            }
        }).start();
    }

    public getSlideValue(): number
    {
        return this.slider.progress;
    }

    public getHitResult(): boolean
    {
        let progress = this.slider.progress;
        return progress >= this._slideConfig.hitZoneLeft && progress <= this._slideConfig.hitZoneRight;
    }

    public setConfig(config: SlideConfig)
    {
        this._slideConfig = config;
        // this._slideConfig.hitZone = clamp(this._slideConfig.hitZone, 0, 1);
        this.hitzone.left = this._width * this._slideConfig.hitZoneLeft;
        this.hitzone.right = (1 - this._slideConfig.hitZoneRight) * this._width;
    }

    private getSlideTween(): Tween<Slider>
    {
        let t1 = tween(this.slider)
            .to(this._slideConfig.sliderCycleTime, { progress: 1 },
                {
                    easing: "linear",
                    onComplete: (target) => {
                        this._slideTween = null;
                    },
                });

        let t2 = tween(this.slider)
            .to(this._slideConfig.sliderCycleTime, { progress: 0 },
                {
                    easing: "linear",
                    onComplete: (target) => {
                        this._slideTween = null;
                    }
                });
        
        let r = randomRange(0, 1) >= 0.5;
        this.slider.progress = r ? 0 : 1;
        return r ? tween(this.slider).sequence(t1, t2).repeatForever() : tween(this.slider).sequence(t2, t1).repeatForever();
    }
}

